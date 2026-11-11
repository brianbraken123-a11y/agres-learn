import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { getDay, LABEL_CONTOH } from '../content/index.js'
import { useProgressCtx } from '../ProgressContext.jsx'
import { hitungPersen } from '../hooks/useProgress.js'
import ProgressRing from '../components/ProgressRing.jsx'
import ScenePanel from '../components/ScenePanel.jsx'
import MatchingGame from '../components/MatchingGame.jsx'
import CasePractice from '../components/CasePractice.jsx'
import Quiz from '../components/Quiz.jsx'
import StageOrder from '../components/StageOrder.jsx'
import ChatSimulation from '../components/ChatSimulation.jsx'
import SpeakingTimer from '../components/SpeakingTimer.jsx'
import BlankGuide from '../components/BlankGuide.jsx'

const TAB = [
  { id: 'pelajari', label: 'Pelajari' },
  { id: 'praktik', label: 'Praktik' },
  { id: 'kuis', label: 'Kuis' },
  { id: 'review', label: 'Review' },
]

export default function DayPage() {
  const { id } = useParams()
  const day = getDay(id)
  const [params, setParams] = useSearchParams()
  const { progress, tandai, catatKuis, catatSimulasi, catatBicara, setTerakhir, resetHari } = useProgressCtx()
  const [praktikGame, setPraktikGame] = useState(false)
  const [praktikKasus, setPraktikKasus] = useState(false)

  const bagian = TAB.some((t) => t.id === params.get('bagian')) ? params.get('bagian') : 'pelajari'

  useEffect(() => {
    if (day) setTerakhir(day.path, bagian)
  }, [day, bagian, setTerakhir])

  const hari = day ? progress.days?.[day.id] : null
  const persen = hitungPersen(hari)

  const gantiBagian = useCallback(
    (b) => {
      const next = new URLSearchParams(params)
      next.set('bagian', b)
      setParams(next, { replace: true })
    },
    [params, setParams]
  )

  const tandaiPraktik = useCallback(() => {
    tandai(day.id, 'praktik', true)
  }, [day, tandai])

  useEffect(() => {
    if (!day) return
    if (day.id === 3) return
    if (praktikGame && praktikKasus) tandaiPraktik()
  }, [praktikGame, praktikKasus, day, tandaiPraktik])

  const onGameSelesai = useCallback(() => setPraktikGame(true), [])
  const onKasusSelesai = useCallback(() => setPraktikKasus(true), [])
  const onSimulasiSelesai = useCallback(
    (hasil) => {
      catatSimulasi(day.id, hasil)
      tandaiPraktik()
    },
    [catatSimulasi, day, tandaiPraktik]
  )
  const onKuisSelesai = useCallback(
    (hasil) => {
      catatKuis(day.id, hasil)
    },
    [catatKuis, day]
  )
  const onBicaraSimpan = useCallback(
    (hasil) => {
      catatBicara(day.id, hasil)
    },
    [catatBicara, day]
  )

  const pasanganGame = useMemo(
    () =>
      day
        ? day.komponen.map((k) => ({ id: k.id, nama: k.nama, singkat: k.singkat }))
        : [],
    [day]
  )

  if (!day) return <Navigate to="/" replace />

  const statusBagian = {
    pelajari: hari?.pelajari,
    praktik: hari?.praktik,
    kuis: Boolean(hari?.kuis),
    review: hari?.review,
  }

  return (
    <div className="modul">
      <nav className="remah" aria-label="Remah roti">
        <Link to="/">Semua hari</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {day.hari} · {day.judul}
        </span>
      </nav>

      <header className="modul-kepala">
        <div>
          <p className="hero-label">
            {day.hari} · {day.tanggal}
          </p>
          <h1>{day.judul}</h1>
          <p className="modul-tagline">{day.tagline}</p>
        </div>
        <ProgressRing persen={persen} ukuran={64} label={`Progres ${day.judul} ${persen} persen`} />
      </header>

      <div className="alur" role="tablist" aria-label="Alur belajar">
        {TAB.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={bagian === t.id}
            className={`alur-tab ${bagian === t.id ? 'aktif' : ''} ${statusBagian[t.id] ? 'beres' : ''}`}
            onClick={() => gantiBagian(t.id)}
          >
            <span className="alur-nomor" aria-hidden="true">
              {statusBagian[t.id] ? '✓' : i + 1}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {bagian === 'pelajari' ? (
        <section className="bagian" aria-labelledby="judul-pelajari">
          <h2 id="judul-pelajari">Pelajari</h2>
          <div className="kartu-inti">
            <p>{day.inti}</p>
            <p>{day.intiKedua}</p>
            {day.polaPresentasi ? (
              <p className="chips">
                {day.polaPresentasi.map((p, i) => (
                  <span key={p} className="chip chip-alur">
                    {i + 1}. {p}
                  </span>
                ))}
              </p>
            ) : (
              <p className="chips">
                {['Kebutuhan', 'Fitur', 'Manfaat', 'Cek varian'].map((p, i) => (
                  <span key={p} className="chip chip-alur">
                    {i + 1}. {p}
                  </span>
                ))}
              </p>
            )}
          </div>

          {day.jenisBedah === 'layanan' ? (
            <div className="tahap-pelajari">
              <h3>Delapan tahap pelayanan</h3>
              <p className="teks-halus">Label materi: <em>{LABEL_CONTOH}</em>.</p>
              <ol className="tahap-daftar">
                {day.tahap.map((t) => (
                  <li key={t.id}>
                    <details>
                      <summary>
                        <span className="tahap-nomor" aria-hidden="true">
                          {t.no}
                        </span>
                        <strong>{t.nama}</strong>
                        <span className="tahap-tujuan">{t.tujuan}</span>
                      </summary>
                      <p className="contoh-kalimat">{t.contoh}</p>
                      <p className="teks-halus">{t.ringkas}</p>
                    </details>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <ScenePanel day={day} />
          )}

          <details className="pendalaman">
            <summary>
              <strong>Pendalaman: {day.pendalaman.judul}</strong>
              <span className="teks-halus">Buka kalau mau belajar lebih dalam</span>
            </summary>
            <p>{day.pendalaman.pembuka}</p>
            {day.jenisBedah !== 'layanan' ? (
              <div className="tabel-bungkus">
                <table>
                  <caption className="teks-halus">Cara membaca spesifikasi dan yang perlu dicek per komponen</caption>
                  <thead>
                    <tr>
                      <th scope="col">Komponen</th>
                      <th scope="col">Cara menjelaskan</th>
                      <th scope="col">Yang harus dicek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.komponen.map((k) => (
                      <tr key={k.id}>
                        <th scope="row">{k.nama}</th>
                        <td>{k.caraBaca}</td>
                        <td>{k.cek}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </details>

          {day.kasus.length > 0 ? (
            <div className="kasus-baca">
              <h3>Tiga kasus {day.jenisBedah === 'hp' ? 'pemakaian' : 'customer'}</h3>
              <p className="teks-halus">Baca dulu di sini, latihannya ada di tab Praktik.</p>
              <div className="kasus-grid">
                {day.kasus.map((k) => (
                  <article key={k.id} className="kasus-kartu">
                    <h4>{k.judul}</h4>
                    <p>{k.isi}</p>
                    <p className="label-kecil">Pertanyaan yang perlu diajukan</p>
                    <ul>
                      {k.tanya.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {day.latihanSingkat ? (
            <div className="latihan-singkat">
              <h3>Latihan singkat</h3>
              <p>{day.latihanSingkat.skenario}</p>
              <p className="label-kecil">Contoh jawaban yang bisa dicek</p>
              <ul>
                {day.latihanSingkat.contoh.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="bagian-aksi">
            <button
              type="button"
              className={`tombol ${hari?.pelajari ? 'tombol-garis' : 'tombol-utama'}`}
              onClick={() => tandai(day.id, 'pelajari', !hari?.pelajari)}
              aria-pressed={Boolean(hari?.pelajari)}
            >
              {hari?.pelajari ? 'Batalkan tanda selesai' : 'Tandai Pelajari selesai'}
            </button>
            <button type="button" className="tombol tombol-halus" onClick={() => gantiBagian('praktik')}>
              Lanjut ke Praktik →
            </button>
          </div>
        </section>
      ) : null}

      {bagian === 'praktik' ? (
        <section className="bagian" aria-labelledby="judul-praktik">
          <h2 id="judul-praktik">Praktik</h2>

          {day.jenisBedah === 'layanan' ? (
            <div className="praktik-tumpuk">
              <StageOrder tahap={day.tahap} onSelesai={tandaiPraktik} />
              <ChatSimulation simulasi={day.simulasi} onSelesai={onSimulasiSelesai} />
              <SpeakingTimer
                latihan={day.latihanBicara}
                nilaiAwal={progress.bicara?.[day.id]}
                onSimpan={onBicaraSimpan}
              />
              <BlankGuide panduan={day.panduanBlank} />
            </div>
          ) : (
            <div className="praktik-tumpuk">
              <MatchingGame pasangan={pasanganGame} onSelesai={onGameSelesai} />
              <CasePractice kasus={day.kasus} onSelesai={onKasusSelesai} />
            </div>
          )}

          <div className="bagian-aksi">
            <button
              type="button"
              className={`tombol ${hari?.praktik ? 'tombol-garis' : 'tombol-utama'}`}
              onClick={() => tandai(day.id, 'praktik', !hari?.praktik)}
              aria-pressed={Boolean(hari?.praktik)}
            >
              {hari?.praktik ? 'Batalkan tanda selesai' : 'Tandai Praktik selesai'}
            </button>
            <button type="button" className="tombol tombol-halus" onClick={() => gantiBagian('kuis')}>
              Lanjut ke Kuis →
            </button>
          </div>
        </section>
      ) : null}

      {bagian === 'kuis' ? (
        <section className="bagian" aria-labelledby="judul-kuis">
          <h2 id="judul-kuis">Kuis</h2>
          <p className="teks-halus">
            Gabungan hafalan dan studi kasus. Setelah selesai, kamu dapat skor, pembahasan, dan opsi mengulang soal
            yang salah.
          </p>
          <Quiz
            key={day.id}
            kuis={day.kuis}
            judul={`Kuis ${day.judul}`}
            onSelesai={onKuisSelesai}
            catatanTerbaik={
              hari?.kuis ? `${hari.kuis.skor}/${hari.kuis.total}` : null
            }
          />
          <div className="bagian-aksi">
            <button type="button" className="tombol tombol-halus" onClick={() => gantiBagian('review')}>
              Lanjut ke Review →
            </button>
          </div>
        </section>
      ) : null}

      {bagian === 'review' ? (
        <section className="bagian" aria-labelledby="judul-review">
          <h2 id="judul-review">Review</h2>
          <div className="kartu-hafalan">
            <p className="label-kecil">Hafalan {day.judul}</p>
            <p className="hafalan-teks">{day.hafalan}</p>
          </div>

          <div className="ringkas-hasil">
            <div>
              <span className="label-kecil">Kuis terbaik</span>
              <strong>{hari?.kuis ? `${hari.kuis.skor}/${hari.kuis.total}` : '—'}</strong>
            </div>
            {day.id === 3 ? (
              <div>
                <span className="label-kecil">Simulasi tepat tanpa dibetulkan</span>
                <strong>
                  {progress.simulasi?.[day.id]
                    ? `${progress.simulasi[day.id].tepat}/${progress.simulasi[day.id].total} langkah`
                    : '—'}
                </strong>
              </div>
            ) : null}
            <div>
              <span className="label-kecil">Progres modul</span>
              <strong>{persen}%</strong>
            </div>
          </div>

          {day.latihan.length > 0 ? (
            <div className="latihan-pembahasan">
              <h3>Latihan dan pembahasan</h3>
              <ul className="tanya-jawab">
                {day.latihan.map((l) => (
                  <li key={l.soal}>
                    <details>
                      <summary>{l.soal}</summary>
                      <p>{l.jawab}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="latihan-pembahasan">
              <h3>Yang perlu diingat</h3>
              <ul>
                <li>{day.polaPresentasi.join(' → ')}</li>
                <li>{day.panduanBlank.ringkas}</li>
                <li>Semua yang menyangkut angka, harga, atau garansi: cek varian dulu sebelum menjawab.</li>
              </ul>
            </div>
          )}

          <div className="bagian-aksi">
            <button
              type="button"
              className={`tombol ${hari?.review ? 'tombol-garis' : 'tombol-utama'}`}
              onClick={() => tandai(day.id, 'review', !hari?.review)}
              aria-pressed={Boolean(hari?.review)}
            >
              {hari?.review ? 'Batalkan tanda selesai' : 'Tandai Review selesai'}
            </button>
            <Link className="tombol tombol-halus" to="/review">
              Hafalan gabungan
            </Link>
            <button
              type="button"
              className="tombol tombol-halus"
              onClick={() => {
                if (window.confirm(`Hapus progres ${day.judul} saja?`)) resetHari(day.id)
              }}
            >
              Reset modul ini
            </button>
          </div>

          <nav className="pindah-hari" aria-label="Pindah hari">
            {day.id > 1 ? <Link to="/hari/1">← Hari 1</Link> : <span />}
            {day.id < 3 ? (
              <Link to={`/hari/${day.id + 1}`}>Hari {day.id + 1} →</Link>
            ) : (
              <Link to="/">Selesai, balik ke halaman utama →</Link>
            )}
          </nav>
        </section>
      ) : null}
    </div>
  )
}
