import { useCallback, useEffect, useMemo, useState } from 'react'

function acak(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchingGame({ pasangan, judul = 'Cocokkan komponen dengan fungsinya', onSelesai }) {
  const [kiri, setKiri] = useState(() => acak(pasangan))
  const [kanan, setKanan] = useState(() => acak(pasangan))
  const [pilihKiri, setPilihKiri] = useState(null)
  const [cocok, setCocok] = useState([])
  const [salah, setSalah] = useState(0)
  const [salahId, setSalahId] = useState(null)
  const [selesai, setSelesai] = useState(false)
  const [versi, setVersi] = useState(0)

  const jumlah = pasangan.length

  const cek = useCallback(
    (idKiri, idKanan) => {
      if (idKiri === idKanan) {
        setCocok((c) => {
          const baru = c.includes(idKiri) ? c : [...c, idKiri]
          if (baru.length === jumlah) setSelesai(true)
          return baru
        })
        setPilihKiri(null)
        setSalahId(null)
      } else {
        setSalah((s) => s + 1)
        setSalahId(idKanan)
        window.setTimeout(() => setSalahId(null), 700)
        setPilihKiri(null)
      }
    },
    [jumlah]
  )

  function pilihItemKiri(id) {
    if (cocok.includes(id) || selesai) return
    setPilihKiri((p) => (p === id ? null : id))
  }

  function pilihItemKanan(id) {
    if (cocok.includes(id) || selesai) return
    if (!pilihKiri) {
      setSalahId(id)
      window.setTimeout(() => setSalahId(null), 700)
      return
    }
    cek(pilihKiri, id)
  }

  useEffect(() => {
    if (selesai) {
      onSelesai?.({ total: jumlah, salah, versi })
    }
  }, [selesai, jumlah, salah, versi, onSelesai])

  function ulangi() {
    setKiri(acak(pasangan))
    setKanan(acak(pasangan))
    setPilihKiri(null)
    setCocok([])
    setSalah(0)
    setSalahId(null)
    setSelesai(false)
    setVersi((v) => v + 1)
  }

  const sisa = useMemo(() => jumlah - cocok.length, [jumlah, cocok.length])

  return (
    <section className="game" aria-labelledby={`game-${versi}`}>
      <div className="game-kepala">
        <h3 id={`game-${versi}`}>{judul}</h3>
        <p className="teks-halus">
          Pilih satu kartu di kolom komponen, lalu pilih fungsinya. Bisa pakai tap, klik, atau keyboard (Tab lalu
          Enter/Spasi).
        </p>
      </div>

      <p className="game-status" role="status" aria-live="polite">
        {selesai
          ? `Selesai. ${jumlah} pasangan benar dengan ${salah} percobaan salah.`
          : `${cocok.length} dari ${jumlah} pasangan cocok. Sisa ${sisa}.`}
      </p>

      <div className="papan-game">
        <div className="kolom-game">
          <h4>Komponen / tahap</h4>
          <ul role="list">
            {kiri.map((p) => {
              const sudah = cocok.includes(p.id)
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`game-kartu ${sudah ? 'game-kartu-beres' : ''} ${
                      pilihKiri === p.id ? 'game-kartu-pilih' : ''
                    }`}
                    onClick={() => pilihItemKiri(p.id)}
                    aria-pressed={pilihKiri === p.id}
                    disabled={sudah || selesai}
                  >
                    {p.nama}
                    {sudah ? <span className="game-tanda" aria-hidden="true"> ✓</span> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="kolom-game">
          <h4>Fungsi / manfaat</h4>
          <ul role="list">
            {kanan.map((p) => {
              const sudah = cocok.includes(p.id)
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`game-kartu ${sudah ? 'game-kartu-beres' : ''} ${
                      salahId === p.id ? 'game-kartu-salah' : ''
                    }`}
                    onClick={() => pilihItemKanan(p.id)}
                    disabled={sudah || selesai}
                  >
                    {p.singkat}
                    {sudah ? <span className="game-tanda" aria-hidden="true"> ✓</span> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="aksi-baris">
        <button type="button" className="tombol tombol-garis" onClick={ulangi}>
          {selesai ? 'Main lagi (acak ulang)' : 'Acak ulang'}
        </button>
      </div>
    </section>
  )
}
