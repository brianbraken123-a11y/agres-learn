import { useMemo, useState } from 'react'

const GANGGUAN = [
  'Warna bodi apa yang paling cocok buat Kakak?',
  'Sudah pernah pakai merek ini sebelumnya?',
  'Mau tambah aksesori apa aja?',
  'Kakak lebih suka kemasan atau tanpa kemasan?',
  'Boleh minta nama lengkap dulu sebelum kita mulai?',
  'Kalau ada stok warna lain, mau lihat juga?',
]

export default function CasePractice({ kasus, onSelesai }) {
  const [aktifIdx, setAktifIdx] = useState(0)
  const [pilih, setPilih] = useState([])
  const [dinilai, setDinilai] = useState(false)
  const [tampilJelaskan, setTampilJelaskan] = useState(false)
  const k = kasus[aktifIdx]

  const kandidat = useMemo(() => {
    const benar = k.tanya.map((t) => ({ teks: t, benar: true }))
    const palsu = GANGGUAN.slice(0, 3).map((t) => ({ teks: t, benar: false }))
    const semua = [...benar, ...palsu]
    for (let i = semua.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[semua[i], semua[j]] = [semua[j], semua[i]]
    }
    return semua
  }, [k.id])

  const tepat = kandidat.filter((x) => x.benar && pilih.includes(x.teks)).length
  const jumlahBenar = kandidat.filter((x) => x.benar).length
  const jumlahPalsuDipilih = kandidat.filter((x) => !x.benar && pilih.includes(x.teks)).length

  function toggle(teks) {
    if (dinilai) return
    setPilih((p) => (p.includes(teks) ? p.filter((x) => x !== teks) : [...p, teks]))
  }

  function pindah(i) {
    setAktifIdx(i)
    setPilih([])
    setDinilai(false)
    setTampilJelaskan(false)
  }

  return (
    <section className="kasus-latihan" aria-labelledby="judul-kasus">
      <div className="kasus-nav" role="tablist" aria-label="Pilih kasus">
        {kasus.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === aktifIdx}
            className={`chip-pilih ${i === aktifIdx ? 'aktif' : ''}`}
            onClick={() => pindah(i)}
          >
            Kasus {i + 1}
          </button>
        ))}
      </div>

      <h3 id="judul-kasus">{k.judul}</h3>
      <p className="kasus-isi">{k.isi}</p>

      <p className="label-kecil">Pilih semua pertanyaan yang perlu kamu ajukan</p>
      <ul className="kasus-opsi" role="list">
        {kandidat.map((x) => {
          const dipilih = pilih.includes(x.teks)
          let kelas = dipilih ? 'dipilih' : ''
          if (dinilai) {
            if (x.benar && dipilih) kelas = 'benar'
            else if (x.benar && !dipilih) kelas = 'terlewat'
            else if (!x.benar && dipilih) kelas = 'salah'
          }
          return (
            <li key={x.teks}>
              <button
                type="button"
                className={`opsi-kotak ${kelas}`}
                onClick={() => toggle(x.teks)}
                aria-pressed={dipilih}
                disabled={dinilai}
              >
                <span className="kotak-tanda" aria-hidden="true">
                  {dipilih ? '✓' : ''}
                </span>
                <span>{x.teks}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="aksi-baris">
        <button
          type="button"
          className="tombol tombol-utama"
          disabled={pilih.length === 0 || dinilai}
          onClick={() => {
            setDinilai(true)
            onSelesai?.({ kasus: k.id })
          }}
        >
          Cek jawaban
        </button>
        {dinilai ? (
          <button type="button" className="tombol tombol-garis" onClick={() => setTampilJelaskan((t) => !t)}>
            {tampilJelaskan ? 'Sembunyikan penjelasan' : 'Lihat cara menjelaskannya'}
          </button>
        ) : null}
      </div>

      {dinilai ? (
        <div className="umpan umpan-netral" role="status" aria-live="polite">
          <strong>
            {tepat} dari {jumlahBenar} pertanyaan penting kepilih.
          </strong>{' '}
          {jumlahPalsuDipilih > 0
            ? `Ada ${jumlahPalsuDipilih} pertanyaan yang belum nyambung ke kasus ini — itu bukan salah, tapi belum membantu memilih varian.`
            : 'Nggak ada pertanyaan yang keluar jalur.'}
        </div>
      ) : null}

      {tampilJelaskan ? (
        <div className="kasus-jelaskan">
          <h4>Cara menjelaskan manfaatnya</h4>
          <p>{k.jelaskan}</p>
        </div>
      ) : null}

      <div className="aksi-baris">
        {aktifIdx + 1 < kasus.length ? (
          <button type="button" className="tombol tombol-garis" onClick={() => pindah(aktifIdx + 1)}>
            Kasus berikutnya
          </button>
        ) : null}
      </div>
    </section>
  )
}
