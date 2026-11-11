import { useEffect, useRef, useState } from 'react'

function format(s) {
  const m = Math.floor(s / 60)
  const d = s % 60
  return `${String(m).padStart(2, '0')}:${String(d).padStart(2, '0')}`
}

export default function SpeakingTimer({ latihan, nilaiAwal, onSimpan }) {
  const total = latihan.durasiDetik
  const [sisa, setSisa] = useState(total)
  const [jalan, setJalan] = useState(false)
  const [centang, setCentang] = useState(() => nilaiAwal?.centang || [])
  const [pesan, setPesan] = useState('')
  const tikRef = useRef(null)

  useEffect(() => {
    if (!jalan) return undefined
    tikRef.current = window.setInterval(() => {
      setSisa((s) => {
        if (s <= 1) {
          window.clearInterval(tikRef.current)
          setJalan(false)
          setPesan('Waktu habis. Sekarang nilai sendiri pakai lima poin di bawah.')
          return 0
        }
        const berikut = s - 1
        if (berikut === 30) setPesan('Sisa 30 detik. Masih ada waktu buat jelaskan satu manfaat dan satu langkah berikutnya.')
        if (berikut === 10) setPesan('Sisa 10 detik. Tutup dengan satu langkah berikutnya.')
        return berikut
      })
    }, 1000)
    return () => window.clearInterval(tikRef.current)
  }, [jalan])

  function mulai() {
    if (sisa === 0) setSisa(total)
    setPesan('Mulai ngomong. Awali dengan dua pertanyaan ke customer.')
    setJalan(true)
  }

  function stop() {
    setJalan(false)
    setPesan('Timer berhenti. Lanjutkan kapan pun kamu siap.')
  }

  function reset() {
    window.clearInterval(tikRef.current)
    setJalan(false)
    setSisa(total)
    setPesan('')
  }

  function toggle(i) {
    setCentang((c) => {
      const baru = c.includes(i) ? c.filter((x) => x !== i) : [...c, i]
      onSimpan?.({ centang: baru, selesai: baru.length === latihan.rubrik.length })
      return baru
    })
  }

  const persen = Math.round(((total - sisa) / total) * 100)

  return (
    <section className="bicara" aria-labelledby="judul-bicara">
      <h3 id="judul-bicara">Latihan ngomong {total} detik</h3>
      <p className="teks-halus">{latihan.instruksi}</p>

      <div className="timer">
        <div className="timer-angka" aria-hidden="true">
          {format(sisa)}
        </div>
        <div className="timer-batang" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={total - sisa} aria-label="Waktu latihan">
          <span style={{ width: `${persen}%` }} />
        </div>
        <div className="aksi-baris">
          {!jalan ? (
            <button type="button" className="tombol tombol-utama" onClick={mulai}>
              {sisa === total ? 'Mulai timer' : sisa === 0 ? 'Mulai ulang' : 'Lanjutkan'}
            </button>
          ) : (
            <button type="button" className="tombol tombol-garis" onClick={stop}>
              Jeda
            </button>
          )}
          <button type="button" className="tombol tombol-halus" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="timer-pesan" role="status" aria-live="polite">
          {pesan}
        </p>
      </div>

      <div className="bicara-rubrik">
        <h4>Penilaian mandiri lima poin</h4>
        <p className="teks-halus">Dengarkan rekamannya, lalu centang yang benar-benar kamu lakukan.</p>
        <ul role="list">
          {latihan.rubrik.map((r, i) => (
            <li key={r}>
              <label className="centang">
                <input type="checkbox" checked={centang.includes(i)} onChange={() => toggle(i)} />
                <span>{r}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="teks-halus">
          Tercentang {centang.length} dari {latihan.rubrik.length}.
          {centang.length === latihan.rubrik.length ? ' Mantap, itu rekaman yang layak dikirim ke customer beneran.' : ''}
        </p>
        <p className="pola">
          Pola kalimat: <em>{latihan.template}</em>
        </p>
      </div>
    </section>
  )
}
