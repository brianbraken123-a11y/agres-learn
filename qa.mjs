// QA otomatis untuk agres-learn lewat Chrome DevTools Protocol.
// Jalankan: node qa.mjs [baseUrl] [debugPort]
const BASE = process.argv[2] || 'http://localhost:4173'
const PORT = Number(process.argv[3] || 9333)

const hasil = []
function cek(nama, lolos, info = '') {
  hasil.push({ nama, lolos, info })
  console.log(`${lolos ? 'PASS' : 'FAIL'}  ${nama}${info ? ' — ' + info : ''}`)
}

async function targetWs() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/json`)
      const list = await r.json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {
      /* belum siap */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('Chrome debugging target tidak ditemukan')
}

class Klien {
  constructor(ws) {
    this.ws = ws
    this.id = 0
    this.tunggu = new Map()
    this.pendengar = []
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && this.tunggu.has(msg.id)) {
        const { resolve, reject } = this.tunggu.get(msg.id)
        this.tunggu.delete(msg.id)
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
      } else if (msg.method) {
        for (const f of this.pendengar) f(msg)
      }
    })
  }
  kirim(method, params = {}) {
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.tunggu.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
      setTimeout(() => {
        if (this.tunggu.has(id)) {
          this.tunggu.delete(id)
          reject(new Error('timeout ' + method))
        }
      }, 20000)
    })
  }
  async evaluate(expression) {
    const r = await this.kirim('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true,
    })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + expression.slice(0, 120))
    return r.result.value
  }
  async muat(path, tunggu = 1200) {
    await this.kirim('Page.navigate', { url: BASE + path })
    await new Promise((r) => setTimeout(r, tunggu))
  }
  async klik(teks, opsi = {}) {
    const selector = opsi.selector || 'button'
    const js = `(() => {
      const els = [...document.querySelectorAll(${JSON.stringify(selector)})];
      const b = els.find((e) => e.textContent.replace(/\\s+/g,' ').trim().includes(${JSON.stringify(teks)}) && !e.disabled);
      if (!b) return 'tidak-ada';
      b.click();
      return 'ok';
    })()`
    return this.evaluate(js)
  }
  async teks() {
    return this.evaluate('document.body.innerText')
  }
  async teksKecil() {
    return this.evaluate('document.body.innerText.toLowerCase()')
  }
}

const tidur = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const wsUrl = await targetWs()
  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => {
    ws.addEventListener('open', res)
    ws.addEventListener('error', rej)
  })
  const cdp = new Klien(ws)
  await cdp.kirim('Page.enable')
  await cdp.kirim('Runtime.enable')

  const galatKonsol = []
  cdp.pendengar.push((m) => {
    if (m.method === 'Runtime.exceptionThrown') galatKonsol.push(m.params.exceptionDetails.text)
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
      galatKonsol.push(m.params.args.map((a) => a.value || a.description).join(' '))
    }
  })

  // 1. Beranda
  await cdp.muat('/')
  await cdp.evaluate('localStorage.clear()')
  await cdp.muat('/')
  const teksHome = await cdp.teks()
  cek('Beranda: judul & tiga kartu hari', ['Laptop', 'Smartphone', 'Pelayanan penjualan', 'Progres keseluruhan'].every((t) => teksHome.includes(t)))
  const kartu = await cdp.evaluate("document.querySelectorAll('.kartu-hari').length")
  cek('Beranda: jumlah kartu hari = 3', kartu === 3, `ditemukan ${kartu}`)

  // 2. Hari 1 pelajari + canvas 3D
  await cdp.muat('/hari/1')
  const jumlahTab = await cdp.evaluate("document.querySelectorAll('[role=tab]').length")
  cek('Modul: 4 tab alur', jumlahTab === 4, `ditemukan ${jumlahTab}`)
  const kanvas = await cdp.evaluate("!!document.querySelector('.bedah-panggung canvas')")
  cek('Hari 1: kanvas 3D ter-render', kanvas === true)
  const titik = await cdp.evaluate("document.querySelectorAll('.bedah-panggung button').length")
  cek('Hari 1: 9 titik hotspot 3D', titik === 9, `ditemukan ${titik}`)

  // Klik hotspot lewat keyboard-accessible button
  await cdp.evaluate("document.querySelectorAll('.bedah-panggung button')[0].click()")
  await tidur(300)
  const detailAda = await cdp.evaluate("!!document.querySelector('.panel-detail h3')")
  cek('Hari 1: klik hotspot membuka panel detail', detailAda === true)

  // 3. Toggle 2D
  await cdp.klik('2D', { selector: '.sakelar button' })
  await tidur(300)
  const papan2d = await cdp.evaluate("document.querySelectorAll('.papan-2d-titik').length")
  cek('Hari 1: tampilan 2D tersedia dengan 9 materi sama', papan2d === 9, `ditemukan ${papan2d}`)
  await cdp.klik('3D', { selector: '.sakelar button' })

  // 4. Tandai pelajari + persistensi
  await cdp.klik('Tandai Pelajari selesai')
  await tidur(400)
  const setelahTandai = await cdp.evaluate("document.querySelector('.ring-angka').textContent")
  cek('Progres: tandai Pelajari menaikkan ring jadi 25%', setelahTandai === '25%', `ring=${setelahTandai}`)
  await cdp.muat('/hari/1', 1400)
  const setelahReload = await cdp.evaluate("document.querySelector('.ring-angka').textContent")
  cek('Progres: tetap 25% setelah reload', setelahReload === '25%', `ring=${setelahReload}`)

  // 5. Kuis Hari 1 dari awal sampai akhir
  await cdp.muat('/hari/1?bagian=kuis')
  let selesaiKuis = false
  for (let i = 0; i < 12; i++) {
    const sudah = (await cdp.teksKecil()).includes('hasil kuis')
    if (sudah) {
      selesaiKuis = true
      break
    }
    await cdp.evaluate("document.querySelector('.kuis-opsi button:not([disabled])')?.click()")
    await tidur(200)
    const umpan = await cdp.evaluate("!!document.querySelector('.umpan')")
    if (!umpan) {
      cek('Kuis: umpan balik muncul setelah memilih', false, `soal ke-${i + 1}`)
      break
    }
    const lanjut = await cdp.klik('Soal berikutnya')
    if (lanjut !== 'ok') await cdp.klik('Lihat hasil')
    await tidur(300)
  }
  const teksKuis = await cdp.teks()
  if (!selesaiKuis) selesaiKuis = teksKuis.toLowerCase().includes('hasil kuis')
  cek('Kuis: alur sampai hasil akhir', selesaiKuis)
  const skorAda = /Skor \d+ dari 8/.test(teksKuis)
  cek('Kuis: skor & total ditampilkan', skorAda, (teksKuis.match(/Skor[^\n]*/) || [''])[0])
  const adaUlang = teksKuis.includes('Ulangi semua soal')
  cek('Kuis: opsi mengulang tersedia', adaUlang)

  // 6. Game mencocokkan
  await cdp.muat('/hari/1?bagian=praktik')
  const kartuGame = await cdp.evaluate("document.querySelectorAll('.game-kartu').length")
  cek('Game: 18 kartu (9 komponen + 9 fungsi)', kartuGame === 18, `ditemukan ${kartuGame}`)
  // cocokkan semua pasangan berdasarkan urutan teks yang sama id -> pakai data: klik kiri "Layar" lalu fungsi "Menampilkan gambar"
  const pasangan = [
    ['Layar', 'Menampilkan gambar'],
    ['Baterai', 'Menyuplai daya saat lepas charger'],
    ['RAM', 'Ruang kerja sementara aplikasi'],
    ['GPU', 'Mengolah grafis'],
    ['Penyimpanan', 'Menyimpan sistem, aplikasi, dan file'],
    ['Prosesor (CPU)', 'Menjalankan instruksi aplikasi'],
    ['Port', 'Sambungan ke perangkat lain'],
    ['Motherboard', 'Menghubungkan komponen'],
    ['Sistem pendingin', 'Membantu membuang panas'],
  ]
  // keyboard: pastikan kartu fokusable (dicek sebelum kartu dinonaktifkan karena sudah cocok)
  const fokus = await cdp.evaluate(
    "(() => { const b = document.querySelector('.kolom-game:last-child .game-kartu:not([disabled])'); if (!b) return 'kosong'; b.focus(); return document.activeElement === b ? 'ok' : 'gagal'; })()"
  )
  cek('Game: kartu bisa difokus keyboard', fokus === 'ok', fokus)

  for (const [kiri, kanan] of pasangan) {
    const a = await cdp.klik(kiri, { selector: '.kolom-game:first-child .game-kartu' })
    if (a !== 'ok') continue
    await tidur(80)
    await cdp.klik(kanan, { selector: '.kolom-game:last-child .game-kartu' })
    await tidur(150)
  }
  // sisa pasangan diklik lewat pencocokan id di DOM (data tidak diekspos, jadi klik berpasangan berurutan)
  const statusGame = await cdp.evaluate("document.querySelector('.game-status').textContent")
  cek(
    'Game: 9 pasangan bisa dicocokkan sampai selesai',
    /9 dari 9 pasangan cocok/.test(statusGame) || /^Selesai/.test(statusGame),
    statusGame
  )

  // 7. Kasus latihan
  const opsiKasus = await cdp.evaluate("document.querySelectorAll('.opsi-kotak').length")
  cek('Kasus: pilihan pertanyaan tampil', opsiKasus >= 6, `ditemukan ${opsiKasus}`)
  await cdp.evaluate("document.querySelector('.opsi-kotak').click()")
  await tidur(150)
  await cdp.klik('Cek jawaban')
  await tidur(300)
  const umpanKasus = await cdp.evaluate("!!document.querySelector('.umpan-netral')")
  cek('Kasus: umpan balik setelah cek jawaban', umpanKasus === true)

  // 8. Hari 3: urutkan tahap
  await cdp.muat('/hari/3?bagian=praktik')
  const urutanBenar = ['Sapa', 'Gali kebutuhan', 'Konfirmasi', 'Rekomendasikan', 'Jelaskan manfaat', 'Tanggapi keberatan', 'Closing', 'Tindak lanjuti']
  const adaKartu = await cdp.evaluate("document.querySelectorAll('.kartu-tahap').length")
  cek('Hari 3: 8 kartu tahap', adaKartu === 8, `ditemukan ${adaKartu}`)
  for (const nama of urutanBenar) {
    await cdp.klik(nama, { selector: '.kartu-tahap' })
    await tidur(70)
  }
  await cdp.klik('Periksa urutan')
  await tidur(300)
  const statusUrut = await cdp.evaluate("document.querySelector('.urutkan .game-status').textContent")
  cek('Hari 3: urutan delapan tahap terverifikasi benar', /tepat semua/.test(statusUrut), statusUrut)

  // 9. Simulasi chat dari awal sampai akhir
  const jawabanTepat = [
    'Rencananya dipakai buat apa',
    'Boleh kirim model dan variannya',
    'Gue cek informasi garansi untuk varian',
    'mau gue bantu rangkum perbedaannya',
  ]
  for (const j of jawabanTepat) {
    await cdp.klik(j, { selector: '.opsi-chat' })
    await tidur(250)
  }
  const teksSim = await cdp.teks()
  const hasilSim = /hasil simulasi/.test(teksSim.toLowerCase())
  cek('Simulasi: selesai sampai akhir', hasilSim)
  const skorSim = (teksSim.match(/(\d) dari 4 langkah/) || [])[1]
  cek('Simulasi: semua langkah tepat tanpa dibetulkan', skorSim === '4', `skor=${skorSim}`)

  // 10. Uji pilihan kurang tepat lalu boleh perbaiki
  await cdp.klik('Ulangi simulasi')
  await tidur(300)
  await cdp.klik('Langsung ambil aja', { selector: '.opsi-chat' })
  await tidur(300)
  const umpanKurang = await cdp.evaluate("!!document.querySelector('.umpan-inline.kurang')")
  const masihBisaPilih = await cdp.evaluate("document.querySelectorAll('.opsi-chat').length")
  cek('Simulasi: jawaban kurang dapat umpan balik + boleh diperbaiki', umpanKurang && masihBisaPilih > 0, `opsi=${masihBisaPilih}`)

  // 11. Timer latihan ngomong
  const timerAda = await cdp.evaluate("!!document.querySelector('.timer-angka')")
  cek('Hari 3: timer 90 detik tampil', timerAda === true)
  const timerAwal = await cdp.evaluate("document.querySelector('.timer-angka').textContent")
  await cdp.klik('Mulai timer')
  await tidur(1600)
  const timerJalan = await cdp.evaluate("document.querySelector('.timer-angka').textContent")
  cek('Hari 3: timer berjalan', timerAwal !== timerJalan, `${timerAwal} -> ${timerJalan}`)
  await cdp.klik('Jeda')

  // 12. Review gabungan
  await cdp.muat('/review')
  const teksReview = (await cdp.teks()).toLowerCase()
  cek(
    'Review: hafalan gabungan lengkap',
    ['hafalan gabungan', 'laptop', 'smartphone', 'saat lupa alur'].every((t) => teksReview.includes(t))
  )

  // 13. Progres tersimpan & terbaca di beranda
  await cdp.muat('/')
  const teksHome2 = await cdp.teks()
  cek('Beranda: progres kuis & modul terbaca kembali', !teksHome2.includes('Progres keseluruhan 0%'), (teksHome2.match(/Progres keseluruhan \d+%/) || [''])[0])

  // 14. Layout HP: tidak ada overflow horizontal
  for (const path of ['/', '/hari/1', '/hari/3?bagian=praktik', '/review']) {
    await cdp.muat(path)
    await cdp.kirim('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    })
    await tidur(500)
    const lebar = await cdp.evaluate(
      '({doc: document.documentElement.scrollWidth, win: window.innerWidth, body: document.body.scrollWidth})'
    )
    cek(`Layout HP 390px tanpa overflow: ${path}`, lebar.doc <= lebar.win + 1, `scrollWidth=${lebar.doc} innerWidth=${lebar.win}`)
    await cdp.kirim('Emulation.clearDeviceMetricsOverride')
  }

  // 15. Galat konsol
  cek('Tidak ada error konsol selama pengujian', galatKonsol.length === 0, galatKonsol.slice(0, 3).join(' | '))

  const gagal = hasil.filter((h) => !h.lolos)
  console.log(`\nRINGKASAN: ${hasil.length - gagal.length}/${hasil.length} pemeriksaan lolos`)
  if (gagal.length) {
    console.log('GAGAL:')
    for (const g of gagal) console.log(` - ${g.nama} (${g.info})`)
  }
  ws.close()
  process.exit(gagal.length ? 1 : 0)
}

main().catch((e) => {
  console.error('QA error:', e.message)
  process.exit(2)
})
