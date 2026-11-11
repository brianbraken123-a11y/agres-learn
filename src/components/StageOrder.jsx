import { useEffect, useMemo, useState } from 'react'

function acak(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function StageOrder({ tahap, onSelesai }) {
  const [kartu, setKartu] = useState(() => acak(tahap))
  const [urutanPilih, setUrutanPilih] = useState([])
  const [diperiksa, setDiperiksa] = useState(false)
  const kunci = useMemo(() => tahap.map((t) => t.id), [tahap])

  const benar = urutanPilih.filter((id, i) => id === kunci[i]).length

  useEffect(() => {
    if (diperiksa && benar === kunci.length) onSelesai?.({ benar, total: kunci.length })
  }, [diperiksa, benar, kunci.length, onSelesai])

  function pilih(id) {
    if (diperiksa) return
    setUrutanPilih((u) => (u.includes(id) ? u.filter((x) => x !== id) : [...u, id]))
  }

  function ulangi() {
    setKartu(acak(tahap))
    setUrutanPilih([])
    setDiperiksa(false)
  }

  return (
    <section className="urutkan" aria-labelledby="judul-urutkan">
      <h3 id="judul-urutkan">Urutkan delapan tahap pelayanan</h3>
      <p className="teks-halus">
        Klik kartu sesuai urutan yang benar, dari langkah pertama sampai terakhir. Klik lagi buat membatalkan
        pilihan. Materi ini berlabel <em>contoh susunan belajar</em>.
      </p>

      <p className="game-status" role="status" aria-live="polite">
        {diperiksa
          ? benar === kunci.length
            ? 'Urutan tepat semua. Hafalan alurnya sudah nempel.'
            : `${benar} dari ${kunci.length} posisi sudah tepat.`
          : `${urutanPilih.length} dari ${kunci.length} tahap sudah dipilih.`}
      </p>

      <ol className="urutkan-papan" role="list">
        {kartu.map((t) => {
          const posisi = urutanPilih.indexOf(t.id)
          const kelas = diperiksa
            ? posisi === -1
              ? ''
              : kunci[posisi] === t.id
                ? 'benar'
                : 'salah'
            : posisi >= 0
              ? 'dipilih'
              : ''
          return (
            <li key={t.id}>
              <button
                type="button"
                className={`kartu-tahap ${kelas}`}
                onClick={() => pilih(t.id)}
                aria-pressed={posisi >= 0}
                disabled={diperiksa}
              >
                <span className="kartu-tahap-nomor" aria-hidden="true">
                  {posisi >= 0 ? posisi + 1 : '·'}
                </span>
                <span className="kartu-tahap-nama">{t.nama}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="aksi-baris">
        <button
          type="button"
          className="tombol tombol-utama"
          disabled={urutanPilih.length !== kunci.length || diperiksa}
          onClick={() => setDiperiksa(true)}
        >
          Periksa urutan
        </button>
        <button type="button" className="tombol tombol-garis" onClick={ulangi}>
          {diperiksa ? 'Coba lagi' : 'Acak ulang'}
        </button>
      </div>

      {diperiksa ? (
        <div className="kunci-urutan">
          <h4>Urutan yang benar</h4>
          <ol>
            {tahap.map((t) => (
              <li key={t.id}>
                <strong>{t.nama}</strong>
                <p>Tujuan: {t.tujuan}</p>
                <p className="contoh-kalimat">{t.contoh}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}
