import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/*
  LaptopScene — model laptop generik (bukan brand asli) + 9 titik interaktif.

  Kontrak: <LaptopScene activeId="cpu" onSelect={(id) => ...} className="..." />
  Hotspot dirender sebagai <button> DOM di atas canvas, posisinya diproyeksikan
  dari koordinat 3D tiap frame. Jadi bisa di-klik, di-tap, dan di-TAB.

  Catatan implementasi:
  - Modul ini AMAN untuk React.lazy: tidak ada akses window/document di top-level.
  - Semua resource (geometry, material, renderer, controls, listener) dibersihkan
    di return cleanup useEffect.
  - Mengubah activeId TIDAK me-render ulang scene (effect-nya deps kosong).
*/

const HOTSPOTS = [
  { id: 'cpu', label: 'Prosesor (CPU)' },
  { id: 'gpu', label: 'GPU' },
  { id: 'ram', label: 'RAM' },
  { id: 'penyimpanan', label: 'Penyimpanan' },
  { id: 'layar', label: 'Layar' },
  { id: 'baterai', label: 'Baterai' },
  { id: 'motherboard', label: 'Motherboard' },
  { id: 'pendingin', label: 'Pendingin' },
  { id: 'port', label: 'Port' },
]

// Posisi anchor di dunia 3D. Basis laptop membentang x -2..2, z -1.35..1.35,
// permukaan atas di y = 0.15. Marker sengaja "mengambang" sedikit supaya tidak
// tenggelam ke dalam bodi.
const ANCHOR = {
  cpu: [0.55, 0.42, 0.3],
  gpu: [-0.85, 0.4, -0.3],
  ram: [0.05, 0.38, -0.9],
  penyimpanan: [1.45, 0.36, -0.75],
  motherboard: [-0.45, 0.34, 0.7],
  baterai: [1.0, 0.32, 1.0],
  pendingin: [0.0, 0.44, -1.24],
  port: [-2.12, 0.24, -0.1],
}
// 'layar' menempel di grup penutup (lokal), bukan di koordinat dunia.
const ANCHOR_LAYAR = [0.62, -0.16, 1.55]

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

// Cek dukungan WebGL sebelum bikin renderer, biar tidak ada error di console
// dan tidak ada crash di perangkat jadul.
function webglSiap() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

// Geser penanda yang bertumpuk. Hanya sumbu Y yang digeser supaya posisi
// horizontal tetap jujur mengikuti komponen di 3D.
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

export default function LaptopScene({ activeId = null, onSelect, className = '' }) {
  const wadahRef = useRef(null)
  const kanvasRef = useRef(null)
  const markerRefs = useRef({})
  const sempitRef = useRef(false)
  // onSelect disimpan di ref supaya effect scene tidak perlu di-restart saat parent re-render.
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const [sempit, setSempit] = useState(false)
  const [gagal, setGagal] = useState(false)

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
    const kamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    const target = new THREE.Vector3(0, 0.6, 0)
    kamera.position.set(0, 0.6, 0)

    let lebar = wadah.clientWidth || 360
    let tinggi = wadah.clientHeight || 360

    // ---------- bangun laptop dari primitif ----------
    const grup = new THREE.Group()
    grup.position.y = -0.05
    scene.add(grup)

    const matBodi = new THREE.MeshStandardMaterial({ color: '#7f8ba0', metalness: 0.72, roughness: 0.38 })
    const matDeck = new THREE.MeshStandardMaterial({ color: '#c2cbda', metalness: 0.5, roughness: 0.42 })
    const matGelap = new THREE.MeshStandardMaterial({ color: '#141c2a', metalness: 0.35, roughness: 0.7 })
    const matTuts = new THREE.MeshStandardMaterial({
      color: '#0a1424',
      emissive: new THREE.Color('#1e4fd8'),
      emissiveIntensity: 0.5,
      metalness: 0.15,
      roughness: 0.3,
    })
    const matAksen = new THREE.MeshStandardMaterial({
      color: '#0ea5e9',
      emissive: new THREE.Color('#0ea5e9'),
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.4,
    })

    // basis
    const basis = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.14, 2.7), matBodi)
    basis.position.y = 0.07
    grup.add(basis)

    const dek = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.02, 2.56), matDeck)
    dek.position.y = 0.15
    grup.add(dek)

    const sumurTombol = new THREE.Mesh(new THREE.BoxGeometry(3.16, 0.01, 1.34), matGelap)
    sumurTombol.position.set(0, 0.162, -0.34)
    grup.add(sumurTombol)

    // keycap pakai InstancedMesh: 1 geometry + 1 material, 1 draw call
    const BARIS = 6
    const KOLOM = 14
    const geoTombol = new THREE.BoxGeometry(0.185, 0.03, 0.16)
    const keycap = new THREE.InstancedMesh(geoTombol, matGelap, BARIS * KOLOM)
    const matriks = new THREE.Matrix4()
    let ke = 0
    for (let b = 0; b < BARIS; b++) {
      for (let k = 0; k < KOLOM; k++) {
        const x = -1.36 + k * 0.21
        const z = -0.9 + b * 0.2
        matriks.makeTranslation(x, 0.18, z)
        keycap.setMatrixAt(ke++, matriks)
      }
    }
    keycap.instanceMatrix.needsUpdate = true
    grup.add(keycap)

    const touchpad = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.012, 0.66), matDeck)
    touchpad.position.set(0, 0.161, 0.72)
    grup.add(touchpad)
    const garisTouchpad = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.004, 0.012), matGelap)
    garisTouchpad.position.set(0, 0.168, 0.32)
    grup.add(garisTouchpad)

    // kisi ventilasi belakang
    for (let i = 0; i < 7; i++) {
      const kisi = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.05), matAksen)
      kisi.position.set(-0.9 + i * 0.3, 0.16, -1.22)
      grup.add(kisi)
    }

    // port di sisi kiri
    const portUsb = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.2), matGelap)
    portUsb.position.set(-2.0, 0.08, -0.35)
    grup.add(portUsb)
    const portUsb2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.2), matGelap)
    portUsb2.position.set(-2.0, 0.08, 0.05)
    grup.add(portUsb2)
    const portHdmi = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.26), matAksen)
    portHdmi.position.set(-2.0, 0.08, 0.6)
    grup.add(portHdmi)

    // engsel
    const engsel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.7, 14), matGelap)
    engsel.rotation.z = Math.PI / 2
    engsel.position.set(0, 0.14, -1.34)
    grup.add(engsel)

    // penutup + layar
    const togok = new THREE.Group()
    togok.position.set(0, 0.14, -1.32)
    togok.rotation.x = -1.72 // sekitar 98 derajat: agak rebah ke belakang
    grup.add(togok)

    const kulitTutup = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.06, 2.7), matBodi)
    kulitTutup.position.set(0, 0, 1.35)
    togok.add(kulitTutup)

    const bingkaiLayar = new THREE.Mesh(new THREE.BoxGeometry(3.84, 0.012, 2.5), matGelap)
    bingkaiLayar.position.set(0, -0.036, 1.35)
    togok.add(bingkaiLayar)

    const panelLayar = new THREE.Mesh(new THREE.PlaneGeometry(3.62, 2.3), matTuts)
    panelLayar.position.set(0, -0.044, 1.35)
    panelLayar.rotation.x = Math.PI / 2
    togok.add(panelLayar)

    const kameraWebcam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.01, 10),
      matAksen,
    )
    kameraWebcam.rotation.x = Math.PI / 2
    kameraWebcam.position.set(0, -0.03, 2.52)
    togok.add(kameraWebcam)

    const logo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.008, 24), matAksen)
    logo.rotation.x = Math.PI / 2
    logo.position.set(0, 0.036, 1.4)
    togok.add(logo)

    // ---------- anchor hotspot ----------
    const anchors = new Map()
    const buatAnchor = (id, posisi, induk) => {
      const o = new THREE.Object3D()
      o.position.set(posisi[0], posisi[1], posisi[2])
      induk.add(o)
      anchors.set(id, o)
    }
    Object.entries(ANCHOR).forEach(([id, pos]) => buatAnchor(id, pos, grup))
    buatAnchor('layar', ANCHOR_LAYAR, togok)

    // ---------- cahaya ----------
    scene.add(new THREE.HemisphereLight(0xa9c9ff, 0x0b1220, 1.05))
    const lampuUtama = new THREE.DirectionalLight(0xffffff, 1.9)
    lampuUtama.position.set(2.6, 4.2, 3.2)
    scene.add(lampuUtama)
    const lampuIsi = new THREE.DirectionalLight(0x5ca8ff, 0.75)
    lampuIsi.position.set(-3.2, 2.0, -2.2)
    scene.add(lampuIsi)
    const lampuRim = new THREE.PointLight(0x38bdf8, 12, 14, 2)
    lampuRim.position.set(-1.5, 1.2, -2.6)
    scene.add(lampuRim)

    // ---------- kontrol putar ----------
    const kontrol = new OrbitControls(kamera, renderer.domElement)
    kontrol.enableDamping = true
    kontrol.dampingFactor = 0.075
    kontrol.enablePan = false
    kontrol.rotateSpeed = 0.85
    kontrol.zoomSpeed = 0.7
    kontrol.minDistance = 4.5
    kontrol.maxDistance = 13
    kontrol.minPolarAngle = 0.35
    kontrol.maxPolarAngle = Math.PI * 0.495 // jangan sampai kamera ke bawah lantai
    kontrol.target.copy(target)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let kurangiGerak = mq.matches
    let sudahDisentuh = false
    kontrol.autoRotate = !kurangiGerak
    kontrol.autoRotateSpeed = 0.55

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
    let jarakTarget = 6.6
    const arahSementara = new THREE.Vector3()

    const tempatkanKamera = (paksa) => {
      const aspek = lebar / Math.max(tinggi, 1)
      jarakTarget = 6.6 + Math.max(0, 1.4 - aspek) * 2.4
      const sekarang = arahSementara.copy(kamera.position).sub(kontrol.target)
      const panjang = sekarang.length() || 1
      if (paksa) {
        // arah awal: agak dari atas, sedikit miring
        sekarang.set(0.18, 0.46, 0.95).normalize().multiplyScalar(jarakTarget)
      } else {
        sekarang.multiplyScalar(jarakTarget / panjang)
      }
      kamera.position.copy(kontrol.target).add(sekarang)
      kontrol.update()
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
    aturUkuran()
    tempatkanKamera(true)

    const ro = new ResizeObserver(() => {
      const perlu = Math.abs((wadah.clientWidth || 0) - lebar) > 0 ||
        Math.abs((wadah.clientHeight || 0) - tinggi) > 0
      aturUkuran()
      if (perlu) tempatkanKamera(false)
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

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!hidup || !terlihat || document.hidden) return
      jam.getDelta()
      kontrol.update()
      renderer.render(scene, kamera)
      perbaruiPenanda()
    }
    loop()

    // hemat GPU saat scene tidak kelihatan
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
    <div ref={wadahRef} className={`ag3d-wrap ${className}`} data-scene="laptop">
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
      <p className="ag3d-hint">Geser untuk memutar · titik bisa diketuk</p>
    </div>
  )
}
