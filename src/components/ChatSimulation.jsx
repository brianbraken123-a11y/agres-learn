import { useEffect, useRef, useState } from 'react'

export default function ChatSimulation({ simulasi, onSelesai }) {
  const [log, setLog] = useState(() => [
    { peran: 'customer', teks: simulasi.nodes[simulasi.mulai].teks },
  ])
  const [nodeId, setNodeId] = useState(simulasi.mulai)
  const [salahPerNode, setSalahPerNode] = useState({})
  const [selesai, setSelesai] = useState(false)
  const [percobaan, setPercobaan] = useState(0)
  const logRef = useRef(null)
  const kirimRef = useRef(false)

  const node = simulasi.nodes[nodeId]
  const jumlahNode = Object.keys(simulasi.urutan).length
  const tepatSekali = Object.entries(simulasi.urutan).filter(([id]) => !salahPerNode[id]).length

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  useEffect(() => {
    if (selesai && !kirimRef.current) {
      kirimRef.current = true
      onSelesai?.({ tepat: tepatSekali, total: jumlahNode, percobaan })
    }
  }, [selesai, tepatSekali, jumlahNode, percobaan, onSelesai])

  function pilih(opsi) {
    setPercobaan((p) => p + 1)
    if (opsi.nilai === 'tepat') {
      const berikut = simulasi.urutan[nodeId]
      setLog((l) => [
        ...l,
        { peran: 'sales', teks: opsi.teks, umpan: opsi.umpan, nilai: 'tepat' },
        ...(berikut && berikut !== 'selesai'
          ? [{ peran: 'customer', teks: simulasi.nodes[berikut].teks }]
          : [{ peran: 'sistem', teks: simulasi.nodes.selesai.teks }]),
      ])
      if (!berikut || berikut === 'selesai') setSelesai(true)
      else setNodeId(berikut)
    } else {
      setSalahPerNode((s) => ({ ...s, [nodeId]: (s[nodeId] || 0) + 1 }))
      setLog((l) => [...l, { peran: 'sales', teks: opsi.teks, umpan: opsi.umpan, nilai: 'kurang' }])
    }
  }

  function ulangi() {
    kirimRef.current = false
    setLog([{ peran: 'customer', teks: simulasi.nodes[simulasi.mulai].teks }])
    setNodeId(simulasi.mulai)
    setSalahPerNode({})
    setSelesai(false)
    setPercobaan(0)
  }

  return (
    <section className="simulasi" aria-labelledby="judul-simulasi">
      <h3 id="judul-simulasi">{simulasi.judul}</h3>
      <p className="teks-halus">{simulasi.pengantar}</p>

      <div className="chat" ref={logRef} aria-live="polite" aria-label="Percakapan simulasi">
        {log.map((m, i) => (
          <div key={i} className={`gelembung gelembung-${m.peran}`}>
            <span className="gelembung-nama">
              {m.peran === 'customer' ? 'Customer' : m.peran === 'sales' ? 'Kamu' : 'Catatan'}
            </span>
            <p>{m.teks}</p>
            {m.umpan ? (
              <p className={`umpan-inline ${m.nilai === 'tepat' ? 'tepat' : 'kurang'}`}>
                {m.nilai === 'tepat' ? 'Tepat. ' : 'Kurang tepat. '}
                {m.umpan}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {!selesai ? (
        <div className="pilihan-simulasi">
          {node?.catatan ? <p className="label-kecil">{node.catatan}</p> : null}
          <ul role="list">
            {node?.pilihan.map((o) => (
              <li key={o.id}>
                <button type="button" className="opsi opsi-chat" onClick={() => pilih(o)}>
                  {o.teks}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="hasil-simulasi">
          <p className="label-kecil">Hasil simulasi</p>
          <p>
            <strong>
              {tepatSekali} dari {jumlahNode} langkah kamu pilih tepat tanpa perlu dibetulkan.
            </strong>{' '}
            Total {percobaan} pilihan diambil.
          </p>
          <p className="teks-halus">
            Yang dinilai bukan hafalan kalimat, tapi apakah kamu menggali kebutuhan, membandingkan dengan data yang
            bisa dicek, dan mengarahkan ke langkah berikutnya.
          </p>
          <button type="button" className="tombol tombol-garis" onClick={ulangi}>
            Ulangi simulasi
          </button>
        </div>
      )}
    </section>
  )
}
