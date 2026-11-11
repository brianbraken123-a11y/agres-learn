export default function BlankGuide({ panduan }) {
  return (
    <section className="panduan" aria-labelledby="judul-panduan">
      <h3 id="judul-panduan">{panduan.judul}</h3>
      <p className="panduan-ringkas">{panduan.ringkas}</p>
      <ol>
        {panduan.langkah.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ol>
      <p className="teks-halus">
        Dipakai saat customer menyela, kamu keburu cepat, atau lupa sedang di tahap mana. Jeda itu bukan tanda
        lemah — itu tanda kamu sedang mendengar.
      </p>
    </section>
  )
}
