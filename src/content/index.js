import {
  laptopKomponen,
  laptopPendalaman,
  laptopKasus,
  laptopLatihan,
  laptopLatihanSingkat,
  laptopHafalan,
  laptopKuis,
} from './laptop.js'
import {
  hpKomponen,
  hpPendalaman,
  hpKasus,
  hpLatihan,
  hpLatihanSingkat,
  hpHafalan,
  hpKuis,
} from './smartphone.js'
import {
  delapanTahap,
  polaPresentasi,
  alurProductKnowledge,
  simulasi,
  panduanBlank,
  latihanBicara,
  layananHafalan,
  layananKuis,
} from './service.js'

export const LABEL_CONTOH = 'contoh susunan belajar'

export const DAYS = [
  {
    id: 1,
    slug: 'laptop',
    path: '/hari/1',
    tanggal: '9 November 2026',
    hari: 'Hari 1',
    judul: 'Laptop',
    tagline: 'Bedah sembilan komponen, baca spesifikasi, tiga kasus customer.',
    ikon: 'laptop',
    jenisBedah: 'laptop',
    inti:
      'Product knowledge itu kemampuan membaca spesifikasi, memahami fungsinya, dan menjelaskan manfaat yang relevan buat kebutuhan customer.',
    intiKedua:
      'Urutan yang dipakai: kebutuhan → fitur → manfaat → cek varian. Jangan menilai produk dari nama keluarganya saja.',
    komponen: laptopKomponen,
    labelKomponen: `${LABEL_CONTOH} sembilan komponen laptop`,
    pendalaman: laptopPendalaman,
    kasus: laptopKasus,
    latihan: laptopLatihan,
    latihanSingkat: laptopLatihanSingkat,
    hafalan: laptopHafalan,
    kuis: laptopKuis,
    praktik: [
      { id: 'bedah-3d', judul: 'Bedah 3D sembilan komponen', ket: 'Putar laptop, buka tiap titik, baca fungsi dan yang perlu dicek.' },
      { id: 'cocokkan', judul: 'Game mencocokkan', ket: 'Cocokkan komponen dengan fungsinya. Bisa tap, klik, atau keyboard.' },
      { id: 'kasus', judul: 'Tiga kasus customer', ket: 'Susun pertanyaan yang perlu diajukan sebelum merekomendasikan.' },
    ],
  },
  {
    id: 2,
    slug: 'smartphone',
    path: '/hari/2',
    tanggal: '10 November 2026',
    hari: 'Hari 2',
    judul: 'Smartphone',
    tagline: 'Bedah tujuh komponen, buka per lapisan, tiga kasus pemakaian.',
    ikon: 'phone',
    jenisBedah: 'hp',
    inti:
      'Bedah HP dengan cara yang sama. Mulai dari pemakaian customer, lalu cek komponen yang paling berpengaruh di varian yang ditawarkan.',
    intiKedua:
      'Kalimat "HP yang bagus" bisa berarti hasil foto, lancar buat game, atau nyaman kerja seharian. Cari tahu dulu artinya buat customer ini.',
    komponen: hpKomponen,
    labelKomponen: 'tujuh komponen smartphone',
    pendalaman: hpPendalaman,
    kasus: hpKasus,
    latihan: hpLatihan,
    latihanSingkat: hpLatihanSingkat,
    hafalan: hpHafalan,
    kuis: hpKuis,
    praktik: [
      { id: 'bedah-3d', judul: 'Bedah 3D per lapisan', ket: 'Putar smartphone, buka lapisannya, pilih titik komponen.' },
      { id: 'cocokkan', judul: 'Game mencocokkan', ket: 'Cocokkan komponen dengan fungsinya. Bisa tap, klik, atau keyboard.' },
      { id: 'kasus', judul: 'Tiga kasus pemakaian', ket: 'Susun prioritas berdasarkan jawaban customer.' },
    ],
  },
  {
    id: 3,
    slug: 'pelayanan',
    path: '/hari/3',
    tanggal: '11 November 2026',
    hari: 'Hari 3',
    judul: 'Pelayanan penjualan',
    tagline: 'Delapan tahap, simulasi chat bercabang, latihan ngomong 90 detik.',
    ikon: 'chat',
    jenisBedah: 'layanan',
    inti:
      'Pelayanan penjualan itu membantu customer memahami pilihannya sampai dia bisa mengambil keputusan.',
    intiKedua:
      'Pola presentasinya: masalah → kebutuhan → solusi → manfaat → closing. Kalau ngeblank: jeda, ulangi kebutuhan, satu manfaat, sebutkan yang perlu dicek.',
    komponen: delapanTahap.map((t) => ({
      id: t.id,
      nama: t.nama,
      singkat: t.tujuan,
      fungsi: t.tujuan,
      caraBaca: t.ringkas,
      manfaat: t.contoh,
      cek: 'Tujuan tahap ini: ' + t.tujuan,
    })),
    tahap: delapanTahap,
    labelKomponen: `${LABEL_CONTOH} delapan tahap pelayanan`,
    polaPresentasi,
    pendalaman: {
      judul: 'Dari sapaan sampai tindak lanjut',
      pembuka:
        'Delapan tahap ini dipakai sebagai urutan latihan. Tujuannya bukan menghafal kalimat, tapi tahu sedang ada di tahap mana dan apa langkah berikutnya.',
    },
    kasus: [],
    latihan: [],
    latihanSingkat: null,
    hafalan: layananHafalan,
    kuis: layananKuis,
    simulasi,
    panduanBlank,
    latihanBicara,
    praktik: [
      { id: 'urutkan', judul: 'Urutkan delapan tahap', ket: 'Susun tahap pelayanan dari sapaan sampai tindak lanjut.' },
      { id: 'simulasi', judul: 'Simulasi chat bercabang', ket: 'Vivobook Go 14: customer belum jelas kebutuhannya, lalu menyela soal garansi.' },
      { id: 'bicara', judul: 'Latihan ngomong 90 detik', ket: 'Timer + penilaian mandiri lima poin.' },
      { id: 'panduan', judul: 'Panduan saat ngeblank', ket: 'Empat langkah pemulihan saat grogi atau blank.' },
    ],
  },
]

export const REVIEW = {
  judul: 'Hafalan gabungan',
  butir: [
    {
      label: 'Laptop',
      isi: 'Bedakan CPU, GPU, RAM, dan SSD. Lalu cek layar, baterai, motherboard, pendingin, dan port sesuai kebutuhan customer.',
    },
    {
      label: 'Smartphone',
      isi: 'Kaitkan chipset, RAM, penyimpanan, layar, kamera, baterai, dan konektivitas dengan aktivitas sehari-hari.',
    },
    { label: 'Pelayanan', isi: layananHafalan },
    {
      label: 'Saat lupa alur',
      isi: 'Ingat tiga pertanyaan: customer mau ngapain, fitur apa yang membantu, dan informasi apa yang masih perlu dicek?',
    },
  ],
  alurProductKnowledge,
  polaPresentasi,
}

export const SUMBER = {
  nama: 'Rangkuman Training AGRES.ID',
  periode: '9–11 November 2026',
  catatan:
    'Isi website ini disusun dari rangkuman catatan belajar. Daftar sembilan komponen laptop dan delapan tahap pelayanan adalah contoh susunan belajar, bukan rincian resmi dari chat rujukan.',
}

export function getDay(id) {
  return DAYS.find((d) => String(d.id) === String(id))
}
