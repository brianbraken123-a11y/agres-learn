import { useEffect, useMemo, useRef, useState } from 'react'

export default function Quiz({ kuis, judul, onSelesai, catatanTerbaik }) {
  const semuaId = useMemo(() => kuis.map((q) => q.id), [kuis])
  const [urutan, setUrutan] = useState(semuaId)
  const [idx, setIdx] = useState(0)
  const [jawab, setJawab] = useState({})
  const [selesai, setSelesai] = useState(false)
  const kirimRef = useRef(false)
  const umpanRef = useRef(null)

  const soal = kuis.find((q) => q.id === urutan[idx])
  const sudahJawab = soal ? jawab[soal.id] !== undefined : false
  const nilai = soal ? jawab[soal.id] : undefined

  const salah = useMemo(
    () => urutan.filter((id) => jawab[id] !== undefined && !jawab[id].benar),
    [urutan, jawab]
  )
  const benar = useMemo(
    () => urutan.filter((id) => jawab[id]?.benar),
    [urutan, jawab]
  )

  useEffect(() => {
    if (selesai && !kirimRef.current) {
      kirimRef.current = true
      onSelesai?.({
        skor: benar.length,
        total: urutan.length,
        salah,
        waktu: Date.now(),
      })
    }
  }, [selesai, benar.length, urutan.length, salah, onSelesai])

  function pilihOpsi(i) {
    if (sudahJawab || !soal) return
    const benarJawab = i === soal.kunci
    setJawab((j) => ({ ...j, [soal.id]: { pilih: i, benar: benarJawab } }))
    window.setTimeout(() => umpanRef.current?.focus(), 30)
  }

  function lanjut() {
    if (idx + 1 >= urutan.length) {
      setSelesai(true)
    } else {
      setIdx(idx + 1)
    }
  }

  function ulang(idYangDipakai) {
    kirimRef.current = false
    setUrutan(idYangDipakai)
    setIdx(0)
    setJawab({})
    setSelesai(false)
  }

  if (selesai) {
    const persen = urutan.length ? Math.round((benar.length / urutan.length) * 100) : 0
    return (
      <div className="kuis kuis-hasil">
        <p className="label-kecil">Hasil kuis</p>
        <h3>
          Skor {benar.length} dari {urutan.length} ({persen}%)
        </h3>
        <p className="kuis-ringkas" aria-live="polite">
          {persen === 100
            ? 'Semua benar. Bagus — sekarang buktinya di latihan ngomong, bukan cuma di kuis.'
            : persen >= 70
              ? 'Sudah kuat. Baca ulang pembahasan yang salah, lalu ulangi soal itu saja.'
              : 'Masih bolong di beberapa bagian. Baca pembahasannya pelan-pelan, lalu ulangi soal yang salah.'}
        </p>
        {catatanTerbaik != null ? (
          <p className="teks-halus">Skor terbaik yang tersimpan: {catatanTerbaik}</p>
        ) : null}

        {salah.length > 0 ? (
          <div className="kuis-daftar-salah">
            <h4>Yang masih salah</h4>
            <ul>
              {salah.map((id) => {
                const q = kuis.find((x) => x.id === id)
                return (
                  <li key={id}>
                    <strong>{q.soal}</strong>
                    <p>{q.pembahasan}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        <div className="aksi-baris">
          {salah.length > 0 ? (
            <button type="button" className="tombol tombol-utama" onClick={() => ulang(salah)}>
              Ulangi {salah.length} soal yang salah
            </button>
          ) : null}
          <button type="button" className="tombol tombol-garis" onClick={() => ulang(semuaId)}>
            Ulangi semua soal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="kuis">
      <div className="kuis-atas">
        <p className="label-kecil">
          {judul} · soal {idx + 1} dari {urutan.length}
        </p>
        <span className={`chip chip-${soal.tipe}`}>{soal.tipe === 'kasus' ? 'Studi kasus' : 'Hafalan'}</span>
      </div>
      <div className="kuis-batang" aria-hidden="true">
        <span style={{ width: `${((idx + (sudahJawab ? 1 : 0)) / urutan.length) * 100}%` }} />
      </div>
      <h3 className="kuis-soal">{soal.soal}</h3>
      <ul className="kuis-opsi" role="list">
        {soal.opsi.map((o, i) => {
          const dipilih = nilai?.pilih === i
          const kunci = soal.kunci === i
          const kelas = !sudahJawab ? '' : kunci ? 'benar' : dipilih ? 'salah' : 'redup'
          return (
            <li key={i}>
              <button
                type="button"
                className={`opsi ${kelas}`}
                onClick={() => pilihOpsi(i)}
                disabled={sudahJawab}
                aria-pressed={dipilih}
              >
                <span className="opsi-huruf" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{o}</span>
                {sudahJawab && kunci ? <span className="opsi-tanda">kunci</span> : null}
              </button>
            </li>
          )
        })}
      </ul>

      {sudahJawab ? (
        <div
          className={`umpan ${nilai.benar ? 'umpan-benar' : 'umpan-salah'}`}
          tabIndex={-1}
          ref={umpanRef}
          role="status"
          aria-live="polite"
        >
          <strong>{nilai.benar ? 'Tepat.' : 'Belum tepat.'}</strong> {soal.pembahasan}
        </div>
      ) : null}

      <div className="aksi-baris">
        <button
          type="button"
          className="tombol tombol-utama"
          onClick={lanjut}
          disabled={!sudahJawab}
        >
          {idx + 1 >= urutan.length ? 'Lihat hasil' : 'Soal berikutnya'}
        </button>
      </div>
    </div>
  )
}
