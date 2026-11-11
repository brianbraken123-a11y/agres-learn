import { Link } from 'react-router-dom'
import { DAYS, REVIEW, SUMBER, LABEL_CONTOH } from '../content/index.js'
import { useProgressCtx } from '../ProgressContext.jsx'
import { hitungPersen } from '../hooks/useProgress.js'
import ProgressRing from '../components/ProgressRing.jsx'

function Ikon({ jenis }) {
  if (jenis === 'phone') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
        <path d="M10.5 5.4h3" />
        <circle cx="12" cy="18.4" r="0.9" />
      </svg>
    )
  }
  if (jenis === 'chat') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 5.5h16v10H9.5L4 19.5z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="11" rx="1.6" />
      <path d="M2 19h20" />
    </svg>
  )
}

function labelStatus(hari) {
  const bagian = [
    ['pelajari', 'Pelajari'],
    ['praktik', 'Praktik'],
    ['kuis', 'Kuis'],
    ['review', 'Review'],
  ]
  const selesai = bagian.filter(([k]) => (k === 'kuis' ? Boolean(hari?.kuis) : hari?.[k]))
  if (selesai.length === 0) return 'Belum dimulai'
  if (selesai.length === 4) return 'Selesai semua'
  return `${selesai.length} dari 4 bagian selesai`
}

export default function Home() {
  const { progress, totalPersen, resetSemua, beresSemua } = useProgressCtx()
  const terakhir = progress.terakhir

  return (
    <div className="beranda">
      <section className="hero">
        <p className="hero-label">Rangkuman Training · {SUMBER.periode}</p>
        <h1>
          Belajar ulang product knowledge,
          <br />
          lalu latihan ngomong jadi sales.
        </h1>
        <p className="hero-teks">
          Tiga hari materi: laptop, smartphone, dan pelayanan penjualan. Tiap hari punya alur{' '}
          <strong>Pelajari → Praktik → Kuis → Review</strong>, dengan bedah 3D, game mencocokkan, dan simulasi
          chat bercabang.
        </p>
        <div className="hero-aksi">
          {terakhir?.path ? (
            <Link className="tombol tombol-utama" to={terakhir.path}>
              Lanjutkan: {DAYS.find((d) => d.path === terakhir.path)?.judul || 'modul terakhir'}
            </Link>
          ) : (
            <Link className="tombol tombol-utama" to="/hari/1">
              Mulai dari Hari 1
            </Link>
          )}
          <Link className="tombol tombol-garis" to="/review">
            Buka hafalan gabungan
          </Link>
        </div>
        <div className="progres-total">
          <div className="progres-batang" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={totalPersen}>
            <span style={{ width: `${totalPersen}%` }} />
          </div>
          <p>
            Progres keseluruhan <strong>{totalPersen}%</strong>
            {beresSemua ? ' — semua modul beres. Ulangi kuis kapan pun buat ngejaga hafalan.' : ''}
          </p>
        </div>
      </section>

      <section className="daftar-hari" aria-labelledby="judul-hari">
        <h2 id="judul-hari">Pilih hari</h2>
        <div className="kartu-hari-grid">
          {DAYS.map((d) => {
            const hari = progress.days?.[d.id]
            const persen = hitungPersen(hari)
            return (
              <article key={d.id} className="kartu-hari">
                <div className="kartu-hari-atas">
                  <span className="kartu-ikon" aria-hidden="true">
                    <Ikon jenis={d.ikon} />
                  </span>
                  <span className="kartu-meta">
                    {d.hari} · {d.tanggal}
                  </span>
                  <ProgressRing persen={persen} label={`Progres ${d.judul} ${persen} persen`} />
                </div>
                <h3>{d.judul}</h3>
                <p className="kartu-tagline">{d.tagline}</p>
                <p className="kartu-status">{labelStatus(hari)}</p>
                <div className="kartu-aksi">
                  <Link className="tombol tombol-utama tombol-kecil" to={d.path}>
                    {persen === 0 ? 'Mulai hari ini' : persen === 100 ? 'Ulangi' : 'Lanjutkan'}
                  </Link>
                  <Link className="tautan-halus" to={`${d.path}?bagian=review`}>
                    Review
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="kartu-review" aria-labelledby="judul-review">
        <div>
          <h2 id="judul-review">{REVIEW.judul}</h2>
          <p>
            Ringkasan hafalan laptop, smartphone, pelayanan, dan tiga pertanyaan penyelamat saat lupa alur. Bisa
            dibuka kapan saja tanpa mengubah progres.
          </p>
        </div>
        <Link className="tombol tombol-garis" to="/review">
          Buka ringkasan
        </Link>
      </section>

      <section className="catatan-sumber">
        <h2>Tentang materi ini</h2>
        <p>{SUMBER.catatan}</p>
        <p>
          Label <em>{LABEL_CONTOH}</em> dipertahankan pada daftar sembilan komponen laptop dan delapan tahap
          pelayanan. Ilustrasi 3D-nya generik, bukan produk asli.
        </p>
        <button
          type="button"
          className="tombol tombol-halus"
          onClick={() => {
            if (window.confirm('Hapus semua progres belajar di browser ini?')) resetSemua()
          }}
        >
          Reset progres belajar
        </button>
      </section>
    </div>
  )
}
