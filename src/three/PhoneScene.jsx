import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/*
  PhoneScene — smartphone generik (bukan brand asli) + 7 titik interaktif.
  Bisa dibuka per lapisan lewat prop `exploded` (animasi lerp, atau langsung
  kalau pengguna minta gerak minim).

  Kontrak: <PhoneScene activeId="chipset" onSelect={fn} className=".." exploded />
  - Hotspot = <button> DOM yang diproyeksikan dari koordinat 3D tiap frame,
    jadi bisa di-klik, di-tap, dan di-TAB.
  - Aman untuk React.lazy (tidak ada akses window/document di top-level).
  - Ubah activeId / exploded tidak me-render ulang scene 3D.
*/

const HOTSPOTS = [
  { id: 'chipset', label: 'Chipset' },
  { id: 'ram', label: 'RAM' },
  { id: 'penyimpanan', label: 'Penyimpanan' },
  { id: 'layar', label: 'Layar' },
  { id: 'kamera', label: 'Kamera' },
  { id: 'baterai', label: 'Baterai' },
  { id: 'konektivitas', label: 'Konektivitas' },
]

// Anchor lokal di dalam grup lapisan masing-masing (ikut bergerak saat explode).
const ANCHOR_PAPAN = {
  chipset: [0.1, 0.95, 0.16],
  ram: [-0.35, 1.15, 0.16],
  penyimpanan: [-0.3, 0.75, 0.16],
}
const ANCHOR_LAIN = {
  layar: [0.45, 0.55, 0.1],
  // relatif terhadap titik pusat modul kamera (gKameraIsi)
  kamera: [0.4, 0.28, 0.02],
  baterai: [0.32, -0.62, 0.12],
  konektivitas: [-0.62, -1.12, 0.1],
}

// Jarak pisah tiap lapisan saat exploded (satuan scene, arah Y).
// Lapisan layar setinggi 2.98, jadi dia harus naik lebih tinggi dari setengah
// tingginya kalau papan utama mau kelihatan. Seluruh tumpukan lalu dikecilkan
// sedikit (SKALA_PISAH) supaya tetap masuk frame tanpa kamera mundur jauh.
const PISAH = {
  layar: 2.6,
  papan: -0.45,
  kamera: 3.35,
  baterai: -1.0,
  bodi: 0,
}
const SKALA_PISAH = 0.55
// tumpukan terbentang -1.87 .. 4.71 (tengah 1.42) → digeser balik ke tengah
const GESER_PISAH = -1.42 * SKALA_PISAH

const CSS = `
.ag3d-wrap{position:relative;width:100%;height:100%;min-height:340px;overflow:hidden;
  border-radius:20px;background:radial-gradient(120% 95% at 50% 0%,#16233b 0%,#0b1220 72%);
  isolation:isolate;touch-action:pan-y;}
.ag3d-canvas{position:absolute;inset:0;z-index:0;}
.ag3d-canvas canvas{display:block;width:100%;height:100%;touch-action:none;outline:none;}
.ag3d-layer{position:absolute;inset:0;z-index:2;pointer-events:none;}
.ag3d-dot{position:absolute;top:0;left:0;display:flex;align-items:center;gap:6px;padding:2px;
  margin:0;border:0;background:transparent;color:#e8f0ff;font:inherit;cursor:pointer;
  pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;
  transform:translate3d(-9999px,-9999px,0);will-change:transform;}
.ag3d-dot__pin{width:24px;height:24px;flex:0 0 auto;display:grid;place-items:center;border-radius:50%;
  font-size:11px;font-weight:800;line-height:1;letter-spacing:.02em;color:#04121f;background:#7dd3fc;
  box-shadow:0 0 0 2px rgba(125,211,252,.22),0 3px 10px rgba(0,0,0,.5);
  transition:transform .18s ease,background-color .18s ease,box-shadow .18s ease;}
.ag3d-dot__lbl{padding:3px 8px;border-radius:999px;font-size:11.5px;font-weight:600;line-height:1.25;
  white-space:nowrap;color:#e8f0ff;background:rgba(9,17,31,.78);
  box-shadow:inset 0 0 0 1px rgba(148,180,230,.22);transition:background-color .18s ease,color .18s ease;}
.ag3d-dot[aria-pressed="true"] .ag3d-dot__pin{background:#fbbf24;transform:scale(1.3);
  box-shadow:0 0 0 3px rgba(251,191,36,.28),0 4px 14px rgba(0,0,0,.55);}
.ag3d-dot[aria-pressed="true"] .ag3d-dot__lbl{background:#fbbf24;color:#20160a;}
.ag3d-dot:focus{outline:none;}
.ag3d-dot:focus-visible .ag3d-dot__pin{outline:3px solid #fff;outline-offset:2px;}
.ag3d-dot:focus-visible .ag3d-dot__lbl{outline:2px solid #fff;outline-offset:2px;}
.ag3d-dot--mini .ag3d-dot__lbl{display:none;}
.ag3d-dot--mini .ag3d-dot__pin{width:20px;height:20px;font-size:10px;}
.ag3d-fallback{display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;
  font-size:14px;line-height:1.5;color:#a9b8d0;background:radial-gradient(120% 95% at 50% 0%,#16233b 0%,#0b1220 72%);}
.ag3d-hint{position:absolute;left:10px;bottom:8px;z-index:2;pointer-events:none;
  font-size:10.5px;letter-spacing:.02em;color:rgba(169,184,208,.6);}
@media (prefers-reduced-motion: reduce){
  .ag3d-dot__pin,.ag3d-dot__lbl{transition:none;}
}
`

function webglSiap() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

function rapikanTumpukan(titik, jarakMin, lebarTabrakan) {
  for (let putaran = 0; putaran < 2; putaran++) {
    for (let i = 0; i < titik.length; i++) {
      for (let j = i + 1; j < titik.length; j++) {
        const a = titik[i]
        const b = titik[j]
        if (Math.abs(a.x - b.x) > lebarTabrakan) continue
        const beda = b.y - a.y
        const jarak = Math.abs(beda)
        if (jarak >= jarakMin) continue
        const dorong = (jarakMin - jarak) / 2
        const arah = beda >= 0 ? 1 : -1
        a.y -= dorong * arah
        b.y += dorong * arah
      }
    }
  }
}

function bersihkanScene(scene) {
  scene.traverse((o) => {
    if (!o.isMesh && !o.isInstancedMesh && !o.isLine && !o.isPoints) return
    o.geometry?.dispose()
    const mat = o.material
    if (Array.isArray(mat)) {
      mat.forEach((m) => {
        m?.map?.dispose?.()
        m?.dispose?.()
      })
    } else if (mat) {
      mat.map?.dispose?.()
      mat.dispose?.()
    }
  })
  scene.clear()
}

export default function PhoneScene({
  activeId = null,
  onSelect,
  className = '',
  exploded = false,
}) {
  const wadahRef = useRef(null)
  const kanvasRef = useRef(null)
  const markerRefs = useRef({})
  const sempitRef = useRef(false)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // "tujuan" explode dibaca oleh loop render tanpa restart scene
  const explodeRef = useRef(exploded)
  explodeRef.current = exploded
  // dipakai loop untuk menandai "sesuaikan jarak kamera sebentar"
  const perluZoomRef = useRef(1)

  const [sempit, setSempit] = useState(false)
  const [gagal, setGagal] = useState(false)

  useEffect(() => {
    perluZoomRef.current = 1
  }, [exploded])

  useEffect(() => {
    const wadah = wadahRef.current
    const kanvas = kanvasRef.current
    if (!wadah || !kanvas) return

    if (!webglSiap()) {
      setGagal(true)
      return
    }

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setGagal(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    kanvas.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const kamera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)

    let lebar = wadah.clientWidth || 360
    let tinggi = wadah.clientHeight || 360

    // ---------- material bersama ----------
    const matBodi = new THREE.MeshStandardMaterial({ color: '#3a4457', metalness: 0.68, roughness: 0.4 })
    const matRangka = new THREE.MeshStandardMaterial({ color: '#9aa7bd', metalness: 0.85, roughness: 0.28 })
    const matGelap = new THREE.MeshStandardMaterial({ color: '#101825', metalness: 0.4, roughness: 0.65 })
    const matLayar = new THREE.MeshStandardMaterial({
      color: '#081226',
      emissive: new THREE.Color('#2563eb'),
      emissiveIntensity: 0.55,
      metalness: 0.1,
      roughness: 0.22,
    })
    const matPapan = new THREE.MeshStandardMaterial({ color: '#123c2c', metalness: 0.3, roughness: 0.8 })
    const matChip = new THREE.MeshStandardMaterial({
      color: '#1b2430',
      metalness: 0.55,
      roughness: 0.35,
      emissive: new THREE.Color('#0b3a55'),
      emissiveIntensity: 0.4,
    })
    const matEmas = new THREE.MeshStandardMaterial({ color: '#d7a94a', metalness: 0.9, roughness: 0.3 })
    const matBaterai = new THREE.MeshStandardMaterial({ color: '#2c6b52', metalness: 0.25, roughness: 0.75 })
    const matAksen = new THREE.MeshStandardMaterial({
      color: '#0ea5e9',
      emissive: new THREE.Color('#0ea5e9'),
      emissiveIntensity: 0.85,
      metalness: 0.3,
      roughness: 0.35,
    })
    const matLensa = new THREE.MeshStandardMaterial({
      color: '#04070d',
      metalness: 0.95,
      roughness: 0.12,
      emissive: new THREE.Color('#123'),
      emissiveIntensity: 0.5,
    })

    const grup = new THREE.Group()
    scene.add(grup)

    const W = 1.5
    const H = 3.0

    // ---------- lapisan: bodi / rangka ----------
    const gBodi = new THREE.Group()
    grup.add(gBodi)

    const platBelakang = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, H - 0.04, 0.05), matBodi)
    platBelakang.position.z = -0.075
    gBodi.add(platBelakang)

    const relKiri = new THREE.Mesh(new THREE.BoxGeometry(0.06, H, 0.17), matRangka)
    relKiri.position.x = -W / 2 + 0.03
    gBodi.add(relKiri)
    const relKanan = new THREE.Mesh(new THREE.BoxGeometry(0.06, H, 0.17), matRangka)
    relKanan.position.x = W / 2 - 0.03
    gBodi.add(relKanan)
    const relAtas = new THREE.Mesh(new THREE.BoxGeometry(W, 0.06, 0.17), matRangka)
    relAtas.position.y = H / 2 - 0.03
    gBodi.add(relAtas)
    const relBawah = new THREE.Mesh(new THREE.BoxGeometry(W, 0.06, 0.17), matRangka)
    relBawah.position.y = -H / 2 + 0.03
    gBodi.add(relBawah)

    const tombolPower = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.26, 0.05), matGelap)
    tombolPower.position.set(W / 2 + 0.005, 0.55, 0)
    gBodi.add(tombolPower)
    const tombolVolume = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.045), matGelap)
    tombolVolume.position.set(-W / 2 - 0.005, 0.5, 0)
    gBodi.add(tombolVolume)

    // garis antena (bagian dari konektivitas)
    const garisAntena = new THREE.Mesh(new THREE.BoxGeometry(W - 0.16, 0.02, 0.015), matAksen)
    garisAntena.position.set(0, -H / 2 + 0.16, -0.1)
    gBodi.add(garisAntena)
    const garisAntena2 = new THREE.Mesh(new THREE.BoxGeometry(W - 0.16, 0.02, 0.015), matAksen)
    garisAntena2.position.set(0, H / 2 - 0.16, -0.1)
    gBodi.add(garisAntena2)

    // ---------- lapisan: layar depan ----------
    const gLayar = new THREE.Group()
    grup.add(gLayar)
    const bingkai = new THREE.Mesh(new THREE.BoxGeometry(W - 0.02, H - 0.02, 0.02), matGelap)
    bingkai.position.z = 0.085
    gLayar.add(bingkai)
    const kaca = new THREE.Mesh(new THREE.BoxGeometry(W - 0.12, H - 0.12, 0.02), matLayar)
    kaca.position.z = 0.1
    gLayar.add(kaca)
    const pulauKamera = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.03), matGelap)
    pulauKamera.position.set(0, H / 2 - 0.2, 0.115)
    gLayar.add(pulauKamera)

    // ---------- lapisan: baterai ----------
    const gBaterai = new THREE.Group()
    grup.add(gBaterai)
    const sel = new THREE.Mesh(new THREE.BoxGeometry(W - 0.34, 1.5, 0.07), matBaterai)
    sel.position.set(0, -0.12, 0.005)
    gBaterai.add(sel)
    const pita = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.075), matEmas)
    pita.position.set(0, 0.66, 0.005)
    gBaterai.add(pita)
    for (let i = 0; i < 4; i++) {
      const garisSel = new THREE.Mesh(new THREE.BoxGeometry(W - 0.36, 0.012, 0.078), matGelap)
      garisSel.position.set(0, -0.55 + i * 0.34, 0.005)
      gBaterai.add(garisSel)
    }

    // ---------- lapisan: papan utama + chipset ----------
    const gPapan = new THREE.Group()
    grup.add(gPapan)
    const papan = new THREE.Mesh(new THREE.BoxGeometry(W - 0.22, 0.98, 0.05), matPapan)
    papan.position.set(0, 0.86, 0)
    gPapan.add(papan)

    const chipset = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.05), matChip)
    chipset.position.set(0.1, 0.95, 0.045)
    gPapan.add(chipset)
    const chipRam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.04), matChip)
    chipRam.position.set(-0.35, 1.15, 0.04)
    gPapan.add(chipRam)
    const chipSimpan = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.2, 0.04), matChip)
    chipSimpan.position.set(-0.3, 0.75, 0.04)
    gPapan.add(chipSimpan)
    const perisai = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.035), matRangka)
    perisai.position.set(0.34, 0.62, 0.04)
    gPapan.add(perisai)
    const konektor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.04), matEmas)
    konektor.position.set(0.42, 1.18, 0.04)
    gPapan.add(konektor)

    // ---------- lapisan: modul kamera ----------
    // gKamera yang dianimasikan naik-turun; gKameraIsi titik putarnya di tengah
    // modul, supaya saat exploded modul bisa "berbalik" memperlihatkan lensa.
    const gKamera = new THREE.Group()
    grup.add(gKamera)
    const gKameraIsi = new THREE.Group()
    gKameraIsi.position.set(0, 1.14, -0.11)
    gKamera.add(gKameraIsi)

    const modul = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.44, 0.08), matGelap)
    modul.position.set(0, 0, 0)
    gKameraIsi.add(modul)
    const posisiLensa = [-0.26, 0.02]
    posisiLensa.forEach((x) => {
      const lensa = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.1, 18), matLensa)
      lensa.rotation.x = Math.PI / 2
      lensa.position.set(x, 0.02, -0.05)
      gKameraIsi.add(lensa)
      const cincin = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.02, 18), matRangka)
      cincin.rotation.x = Math.PI / 2
      cincin.position.set(x, 0.02, -0.095)
      gKameraIsi.add(cincin)
    })
    const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12), matAksen)
    flash.rotation.x = Math.PI / 2
    flash.position.set(0.32, 0.02, -0.05)
    gKameraIsi.add(flash)

    // ---------- anchor hotspot ----------
    const anchors = new Map()
    const buatAnchor = (id, posisi, induk) => {
      const o = new THREE.Object3D()
      o.position.set(posisi[0], posisi[1], posisi[2])
      induk.add(o)
      anchors.set(id, o)
    }
    Object.entries(ANCHOR_PAPAN).forEach(([id, pos]) => buatAnchor(id, pos, gPapan))
    buatAnchor('layar', ANCHOR_LAIN.layar, gLayar)
    buatAnchor('kamera', ANCHOR_LAIN.kamera, gKameraIsi)
    buatAnchor('baterai', ANCHOR_LAIN.baterai, gBaterai)
    buatAnchor('konektivitas', ANCHOR_LAIN.konektivitas, gBodi)

    // grup lapisan → posisi Y target saat exploded
    const lapisan = [
      { grup: gLayar, pisah: PISAH.layar, y: 0 },
      { grup: gPapan, pisah: PISAH.papan, y: 0 },
      { grup: gKamera, pisah: PISAH.kamera, y: 0 },
      { grup: gBaterai, pisah: PISAH.baterai, y: 0 },
      { grup: gBodi, pisah: PISAH.bodi, y: 0 },
    ]

    // ---------- cahaya ----------
    scene.add(new THREE.HemisphereLight(0xa9c9ff, 0x0b1220, 1.1))
    const lampuUtama = new THREE.DirectionalLight(0xffffff, 1.85)
    lampuUtama.position.set(2.4, 4.0, 3.4)
    scene.add(lampuUtama)
    const lampuIsi = new THREE.DirectionalLight(0x5ca8ff, 0.8)
    lampuIsi.position.set(-3.0, 1.6, -2.4)
    scene.add(lampuIsi)
    const lampuRim = new THREE.PointLight(0x38bdf8, 10, 12, 2)
    lampuRim.position.set(-2.2, 0.8, -2.2)
    scene.add(lampuRim)

    // ---------- kontrol putar ----------
    const kontrol = new OrbitControls(kamera, renderer.domElement)
    kontrol.enableDamping = true
    kontrol.dampingFactor = 0.08
    kontrol.enablePan = false
    kontrol.rotateSpeed = 0.85
    kontrol.zoomSpeed = 0.7
    kontrol.minDistance = 3.0
    kontrol.maxDistance = 13
    kontrol.minPolarAngle = 0.4
    kontrol.maxPolarAngle = Math.PI * 0.495 // jangan tembus lantai
    kontrol.target.set(0, 0, 0)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let kurangiGerak = mq.matches
    let sudahDisentuh = false
    kontrol.autoRotate = !kurangiGerak
    kontrol.autoRotateSpeed = 0.6

    const onMulaiSentuh = () => {
      sudahDisentuh = true
      kontrol.autoRotate = false
    }
    kontrol.addEventListener('start', onMulaiSentuh)

    const onMq = () => {
      kurangiGerak = mq.matches
      kontrol.autoRotate = !kurangiGerak && !sudahDisentuh
    }
    mq.addEventListener?.('change', onMq)

    // ---------- ukuran & kamera ----------
    const arahSementara = new THREE.Vector3()

    const jarakCocok = () => {
      const aspek = lebar / Math.max(tinggi, 1)
      const dasar = 5.0 + Math.max(0, 0.8 - aspek) * 2.6
      return explodeRef.current ? dasar + 0.5 : dasar
    }

    const aturUkuran = () => {
      lebar = wadah.clientWidth || 360
      tinggi = wadah.clientHeight || 360
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(lebar, tinggi, false)
      kamera.aspect = lebar / Math.max(tinggi, 1)
      kamera.updateProjectionMatrix()
      const kecil = lebar < 520
      if (kecil !== sempitRef.current) {
        sempitRef.current = kecil
        setSempit(kecil)
      }
    }

    const pasangKamera = (paksa) => {
      const arah = arahSementara.copy(kamera.position).sub(kontrol.target)
      if (paksa) arah.set(0.12, 0.18, 0.98).normalize()
      else if (arah.lengthSq() < 0.0001) arah.set(0, 0.1, 1)
      arah.normalize().multiplyScalar(jarakCocok())
      kamera.position.copy(kontrol.target).add(arah)
      kontrol.update()
    }

    aturUkuran()
    kamera.position.set(0, 0.4, 5.6)
    pasangKamera(true)

    const ro = new ResizeObserver(() => {
      const beda =
        Math.abs((wadah.clientWidth || 0) - lebar) > 0 ||
        Math.abs((wadah.clientHeight || 0) - tinggi) > 0
      aturUkuran()
      if (beda) pasangKamera(false)
    })
    ro.observe(wadah)

    // ---------- proyeksi hotspot ke DOM ----------
    const titikDunia = new THREE.Vector3()
    const daftarPin = []

    const perbaruiPenanda = () => {
      daftarPin.length = 0
      anchors.forEach((anchor, id) => {
        const el = markerRefs.current[id]
        if (!el) return
        anchor.getWorldPosition(titikDunia)
        titikDunia.project(kamera)
        const x = (titikDunia.x * 0.5 + 0.5) * lebar
        const y = (-titikDunia.y * 0.5 + 0.5) * tinggi
        const luar =
          titikDunia.z > 1 || x < -90 || x > lebar + 90 || y < -90 || y > tinggi + 90
        if (luar) {
          el.style.visibility = 'hidden'
          el.style.pointerEvents = 'none'
          return
        }
        el.style.visibility = 'visible'
        el.style.pointerEvents = ''
        daftarPin.push({ el, x, y })
      })
      rapikanTumpukan(daftarPin, sempitRef.current ? 24 : 30, sempitRef.current ? 26 : 74)
      for (let i = 0; i < daftarPin.length; i++) {
        const p = daftarPin[i]
        p.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`
      }
    }

    // ---------- loop render ----------
    const jam = new THREE.Clock()
    let raf = 0
    let hidup = true
    let terlihat = true
    let putarKamera = 0
    let skalaKini = 1
    let geserKini = 0

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!hidup || !terlihat || document.hidden) return
      const dt = Math.min(jam.getDelta(), 0.05)

      // animasi buka lapisan: lerp halus, atau langsung kalau gerak dikurangi
      for (let i = 0; i < lapisan.length; i++) {
        const lap = lapisan[i]
        const tujuan = explodeRef.current ? lap.pisah : 0
        if (kurangiGerak) lap.y = tujuan
        else lap.y += (tujuan - lap.y) * Math.min(1, dt * 7)
        lap.grup.position.y = lap.y
      }

      // modul kamera berbalik memperlihatkan lensa saat terbuka
      const putarTarget = explodeRef.current ? Math.PI : 0
      if (kurangiGerak) putarKamera = putarTarget
      else putarKamera += (putarTarget - putarKamera) * Math.min(1, dt * 7)
      gKameraIsi.rotation.x = putarKamera

      // keseluruhan grup mengecil + digeser ke tengah saat terbuka
      const skalaTarget = explodeRef.current ? SKALA_PISAH : 1
      const geserTarget = explodeRef.current ? GESER_PISAH : 0
      if (kurangiGerak) {
        skalaKini = skalaTarget
        geserKini = geserTarget
      } else {
        skalaKini += (skalaTarget - skalaKini) * Math.min(1, dt * 7)
        geserKini += (geserTarget - geserKini) * Math.min(1, dt * 7)
      }
      grup.scale.setScalar(skalaKini)
      grup.position.y = geserKini

      // sesuaikan jarak kamera sebentar setelah exploded berubah
      if (perluZoomRef.current > 0) {
        perluZoomRef.current -= dt
        const arah = arahSementara.copy(kamera.position).sub(kontrol.target)
        const targetJarak = jarakCocok()
        const panjang = arah.length() || 1
        const baru = kurangiGerak ? targetJarak : panjang + (targetJarak - panjang) * Math.min(1, dt * 5)
        kamera.position.copy(kontrol.target).add(arah.normalize().multiplyScalar(baru))
        if (perluZoomRef.current <= 0) perluZoomRef.current = 0
      }

      kontrol.update()
      renderer.render(scene, kamera)
      perbaruiPenanda()
    }
    loop()

    let io = null
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          terlihat = entries.some((e) => e.isIntersecting)
        },
        { threshold: 0.01 },
      )
      io.observe(wadah)
    }

    // ---------- cleanup ----------
    return () => {
      hidup = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      ro.disconnect()
      mq.removeEventListener?.('change', onMq)
      kontrol.removeEventListener('start', onMulaiSentuh)
      kontrol.dispose()
      bersihkanScene(scene)
      renderer.dispose()
      renderer.forceContextLoss?.()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  if (gagal) {
    return (
      <div className={`ag3d-fallback ${className}`} role="status">
        Tampilan 3D tidak tersedia di perangkat ini. Pakai tampilan 2D.
      </div>
    )
  }

  return (
    <div ref={wadahRef} className={`ag3d-wrap ${className}`} data-scene="phone">
      <style>{CSS}</style>
      <div ref={kanvasRef} className="ag3d-canvas" aria-hidden="true" />
      <div className="ag3d-layer">
        {HOTSPOTS.map((h, i) => {
          const aktif = activeId === h.id
          return (
            <button
              key={h.id}
              type="button"
              ref={(el) => {
                if (el) markerRefs.current[h.id] = el
                else delete markerRefs.current[h.id]
              }}
              className={`ag3d-dot${sempit ? ' ag3d-dot--mini' : ''}`}
              aria-label={h.label + (aktif ? ' (sedang dibuka)' : '')}
              aria-pressed={aktif}
              title={h.label}
              onClick={() => onSelectRef.current?.(h.id)}
            >
              <span className="ag3d-dot__pin" aria-hidden="true">
                {sempit ? i + 1 : ''}
              </span>
              <span className="ag3d-dot__lbl" aria-hidden="true">
                {h.label}
              </span>
            </button>
          )
        })}
      </div>
      <p className="ag3d-hint">
        {exploded ? 'Lapisan terbuka · geser untuk memutar' : 'Geser untuk memutar · titik bisa diketuk'}
      </p>
    </div>
  )
}
