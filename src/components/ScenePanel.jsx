import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'

const LaptopScene = lazy(() => import('../three/LaptopScene.jsx'))
const PhoneScene = lazy(() => import('../three/PhoneScene.jsx'))

class Batas3D extends Component {
  constructor(props) {
    super(props)
    this.state = { gagal: false }
  }
  static getDerivedStateFromError() {
    return { gagal: true }
  }
  componentDidCatch() {
    /* diamkan: fallback 2D yang dipakai */
  }
  render() {
    if (this.state.gagal) return this.props.fallback
    return this.props.children
  }
}

function cekWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

function Detail({ komponen, label }) {
  if (!komponen) {
    return (
      <div className="panel-detail panel-kosong">
        <p className="label-kecil">{label}</p>
        <p>Pilih satu titik di ilustrasi untuk lihat fungsi, manfaat buat customer, dan yang perlu dicek.</p>
      </div>
    )
  }
  return (
    <div className="panel-detail" aria-live="polite">
      <p className="label-kecil">{label}</p>
      <h3>{komponen.nama}</h3>
      <dl className="detail-daftar">
        <div>
          <dt>Fungsi</dt>
          <dd>{komponen.fungsi}</dd>
        </div>
        <div>
          <dt>Cara membacanya</dt>
          <dd>{komponen.caraBaca}</dd>
        </div>
        {komponen.manfaat ? (
          <div>
            <dt>Manfaat buat customer</dt>
            <dd>{komponen.manfaat}</dd>
          </div>
        ) : null}
        {komponen.tanya ? (
          <div>
            <dt>Contoh pertanyaan ke customer</dt>
            <dd>{komponen.tanya}</dd>
          </div>
        ) : null}
        {komponen.cek ? (
          <div>
            <dt>Yang perlu dicek</dt>
            <dd>{komponen.cek}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}

export default function ScenePanel({ day }) {
  const [aktif, setAktif] = useState(null)
  const [mode, setMode] = useState('3d')
  const [dibuka, setDibuka] = useState(false)
  const [daftarBuka, setDaftarBuka] = useState(true)
  const [webgl, setWebgl] = useState(true)
  const [exploded, setExploded] = useState(false)
  const sudahCek = useRef(false)

  useEffect(() => {
    if (sudahCek.current) return
    sudahCek.current = true
    const ok = cekWebGL()
    setWebgl(ok)
    if (!ok) setMode('2d')
  }, [])

  const komponenAktif = day.komponen.find((k) => k.id === aktif) || null
  const label = day.jenisBedah === 'hp' ? 'Komponen smartphone' : 'Komponen laptop'

  return (
    <section className="bedah" aria-labelledby="judul-bedah">
      <div className="bedah-kepala">
        <div>
          <h3 id="judul-bedah">{day.jenisBedah === 'hp' ? 'Bedah smartphone' : 'Bedah laptop'}</h3>
          <p className="teks-halus">
            {day.jenisBedah === 'hp'
              ? 'Putar perangkatnya, buka lapisan untuk lihat bagian dalam (kalau tersedia), lalu pilih titik komponen.'
              : 'Putar laptopnya, lalu pilih satu dari sembilan titik komponen.'}
          </p>
        </div>
        <div className="bedah-kontrol">
          <div className="sakelar" role="group" aria-label="Pilih tampilan bedah">
            <button
              type="button"
              className={mode === '3d' ? 'aktif' : ''}
              onClick={() => setMode('3d')}
              aria-pressed={mode === '3d'}
              disabled={!webgl}
              title={webgl ? 'Tampilan 3D' : 'Perangkat ini tidak mendukung 3D'}
            >
              3D
            </button>
            <button
              type="button"
              className={mode === '2d' ? 'aktif' : ''}
              onClick={() => setMode('2d')}
              aria-pressed={mode === '2d'}
            >
              2D
            </button>
          </div>
          {day.jenisBedah === 'hp' && mode === '3d' ? (
            <button
              type="button"
              className="tombol tombol-halus tombol-kecil"
              onClick={() => setDibuka((d) => !d)}
              aria-pressed={dibuka}
            >
              {dibuka ? 'Tutup lapisan' : 'Buka per lapisan'}
            </button>
          ) : null}
        </div>
      </div>

      <div className={`bedah-isi ${komponenAktif ? 'ada-pilihan' : ''}`}>
        <div className="bedah-panggung">
          {mode === '3d' ? (
            <Batas3D fallback={<Papan2D day={day} aktif={aktif} onPilih={setAktif} catatan="3D gagal dimuat, ini tampilan 2D-nya." />}>
              <Suspense
                fallback={
                  <div className="panggung-muat" role="status">
                    Memuat model 3D…
                  </div>
                }
              >
                {day.jenisBedah === 'hp' ? (
                  <PhoneScene activeId={aktif} onSelect={setAktif} exploded={dibuka} className="kanvas-3d" />
                ) : (
                  <LaptopScene activeId={aktif} onSelect={setAktif} className="kanvas-3d" />
                )}
              </Suspense>
            </Batas3D>
          ) : (
            <Papan2D day={day} aktif={aktif} onPilih={setAktif} />
          )}
        </div>
        <Detail komponen={komponenAktif} label={label} />
      </div>

      <p className="teks-halus bedah-catatan">
        Ilustrasi 3D generik, bukan foto produk asli. Nomor titik mengikuti daftar komponen di bawah.
      </p>

      <details
        className="daftar-komponen"
        open={daftarBuka}
        onToggle={(e) => setDaftarBuka(e.currentTarget.open)}
      >
        <summary>
          Daftar komponen — <em>{day.labelKomponen}</em>
        </summary>
        <ol className="komponen-grid">
          {day.komponen.map((k) => (
            <li key={k.id}>
              <button
                type="button"
                className={`komponen-kartu ${aktif === k.id ? 'aktif' : ''}`}
                onClick={() => setAktif(k.id)}
                aria-pressed={aktif === k.id}
              >
                <strong>{k.nama}</strong>
                <span>{k.singkat}</span>
              </button>
            </li>
          ))}
        </ol>
      </details>
    </section>
  )
}

function Papan2D({ day, aktif, onPilih, catatan }) {
  return (
    <div className="papan-2d">
      <p className="label-kecil">Tampilan 2D</p>
      {catatan ? <p className="teks-halus">{catatan}</p> : null}
      <div className="papan-2d-skema" role="group" aria-label="Skema komponen">
        {day.komponen.map((k, i) => (
          <button
            type="button"
            key={k.id}
            className={`papan-2d-titik ${aktif === k.id ? 'aktif' : ''}`}
            onClick={() => onPilih(k.id)}
            aria-pressed={aktif === k.id}
          >
            <span className="papan-2d-nomor" aria-hidden="true">
              {i + 1}
            </span>
            <span className="papan-2d-nama">{k.nama}</span>
          </button>
        ))}
      </div>
      <p className="teks-halus">Materi dan latihan tetap sama, cuma tanpa tampilan 3D.</p>
    </div>
  )
}
