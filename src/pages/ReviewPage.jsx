import { Link } from 'react-router-dom'
import { DAYS, REVIEW, SUMBER } from '../content/index.js'
import { useProgressCtx } from '../ProgressContext.jsx'
import { hitungPersen } from '../hooks/useProgress.js'
import ProgressRing from '../components/ProgressRing.jsx'

export default function ReviewPage() {
  const { progress } = useProgressCtx()

  return (
    <div className="halaman-review">
      <nav className="remah" aria-label="Remah roti">
        <Link to="/">Semua hari</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Hafalan gabungan</span>
      </nav>

      <header className="modul-kepala">
        <div>
          <p className="hero-label">Bisa dibuka kapan saja</p>
          <h1>{REVIEW.judul}</h1>
          <p className="modul-tagline">
            Ringkasan satu halaman buat dibaca sebelum ngobrol sama customer. Nggak mengubah progres modul.
          </p>
        </div>
      </header>

      <section className="review-grid" aria-label="Ringkasan hafalan">
        {REVIEW.butir.map((b) => (
          <article key={b.label} className="kartu-hafalan">
            <p className="label-kecil">{b.label}</p>
            <p className="hafalan-teks">{b.isi}</p>
          </article>
        ))}
      </section>

      <section className="alur-ingat" aria-labelledby="judul-alur">
        <h2 id="judul-alur">Dua urutan yang dipakai terus</h2>
        <div className="alur-dua">
          <div>
            <p className="label-kecil">Urutan product knowledge</p>
            <ol className="alur-chips">
              {REVIEW.alurProductKnowledge.map((a) => (
                <li key={a} className="chip chip-alur">
                  {a}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="label-kecil">Pola presentasi pelayanan</p>
            <ol className="alur-chips">
              {REVIEW.polaPresentasi.map((a) => (
                <li key={a} className="chip chip-alur">
                  {a}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="ringkas-per-hari" aria-labelledby="judul-per-hari">
        <h2 id="judul-per-hari">Status per hari</h2>
        <ul role="list" className="baris-hari">
          {DAYS.map((d) => {
            const h = progress.days?.[d.id]
            const persen = hitungPersen(h)
            return (
              <li key={d.id}>
                <Link to={`${d.path}?bagian=review`} className="baris-hari-dalam">
                  <ProgressRing persen={persen} ukuran={44} label={`Progres ${d.judul} ${persen} persen`} />
                  <span className="baris-hari-teks">
                    <strong>
                      {d.hari} · {d.judul}
                    </strong>
                    <small>{d.tanggal}</small>
                  </span>
                  <span className="baris-hari-skor">
                    {h?.kuis ? `Kuis ${h.kuis.skor}/${h.kuis.total}` : 'Kuis belum'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="teks-halus tengah">Sumber: {SUMBER.nama} ({SUMBER.periode}).</p>

      <div className="bagian-aksi tengah-aksi">
        <Link className="tombol tombol-utama" to="/">
          Balik ke halaman utama
        </Link>
      </div>
    </div>
  )
}
