export default function ProgressRing({ persen = 0, ukuran = 56, label }) {
  const r = (ukuran - 8) / 2
  const keliling = 2 * Math.PI * r
  const isi = Math.max(0, Math.min(100, persen))
  const offset = keliling - (isi / 100) * keliling
  return (
    <span
      className="ring"
      style={{ width: ukuran, height: ukuran }}
      role="img"
      aria-label={label || `Progres ${isi} persen`}
    >
      <svg viewBox={`0 0 ${ukuran} ${ukuran}`} width={ukuran} height={ukuran} aria-hidden="true">
        <circle className="ring-latar" cx={ukuran / 2} cy={ukuran / 2} r={r} />
        <circle
          className="ring-isi"
          cx={ukuran / 2}
          cy={ukuran / 2}
          r={r}
          strokeDasharray={keliling}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring-angka">{isi}%</span>
    </span>
  )
}
