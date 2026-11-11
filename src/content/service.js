// Hari 3 · 11 November — Pelayanan penjualan
// Sumber: Rangkuman-Training-AGRES-ID.md. Simulasi Vivobook Go 14 wajib tetap menekankan langkah mengecek varian
// dan tidak boleh menambahkan spesifikasi, harga, stok, atau garansi yang belum diketahui.

export const delapanTahap = [
  {
    no: 1,
    id: 'sapa',
    nama: 'Sapa',
    tujuan: 'Buka percakapan dan tawarkan bantuan.',
    contoh: '"Halo, Kak. Lagi cari laptop buat kebutuhan apa?"',
    ringkas: 'Bukalah percakapan dengan ramah dan siap membantu.',
  },
  {
    no: 2,
    id: 'gali',
    nama: 'Gali kebutuhan',
    tujuan: 'Temukan penggunaan, budget, dan prioritas.',
    contoh: '"Aplikasi yang paling sering dipakai apa? Budget-nya di kisaran berapa?"',
    ringkas: 'Tanyakan pemakaian utama, budget, dan prioritas.',
  },
  {
    no: 3,
    id: 'konfirmasi',
    nama: 'Konfirmasi',
    tujuan: 'Pastikan pemahaman sales sama dengan maksud customer.',
    contoh: '"Berarti prioritasnya lancar buat dokumen, browser, dan meeting, ya?"',
    ringkas: 'Ulangi kebutuhan dengan singkat supaya customer bisa mengoreksi.',
  },
  {
    no: 4,
    id: 'rekomendasikan',
    nama: 'Rekomendasikan',
    tujuan: 'Tawarkan opsi setelah varian dan informasi terkait dicek.',
    contoh: '"Gue cek varian yang sesuai sama kebutuhan dan budget Kakak dulu, ya."',
    ringkas: 'Tawarkan opsi yang nyambung dengan kebutuhan tadi.',
  },
  {
    no: 5,
    id: 'jelaskan',
    nama: 'Jelaskan manfaat',
    tujuan: 'Terjemahkan fitur jadi manfaat yang bisa dibayangkan.',
    contoh:
      '"Karena Kakak sering buka beberapa aplikasi sekaligus, kapasitas RAM jadi salah satu hal yang kita cek."',
    ringkas: 'Hubungkan fitur yang sudah dicek dengan aktivitas customer.',
  },
  {
    no: 6,
    id: 'tanggapi',
    nama: 'Tanggapi keberatan',
    tujuan: 'Cari tahu penyebab ragu dan jawab dengan informasi yang bisa dicek.',
    contoh: '"Yang bikin ragu lebih ke harga, performa, atau garansinya?"',
    ringkas:
      'Cari tahu apa yang masih bikin ragu. Saat membandingkan, pakai varian yang jelas dan cek informasi seperti garansi sebelum menjawab.',
  },
  {
    no: 7,
    id: 'closing',
    nama: 'Closing',
    tujuan: 'Arahkan ke satu langkah berikutnya.',
    contoh: '"Mau gue bantu cek varian dan totalnya dulu, Kak?"',
    ringkas: 'Ajak customer memilih langkah berikutnya, misalnya cek varian atau lanjut pesan.',
  },
  {
    no: 8,
    id: 'tindak-lanjut',
    nama: 'Tindak lanjuti',
    tujuan: 'Penuhi janji dan beri customer informasi yang dibutuhkan.',
    contoh: '"Ini rangkuman kebutuhan dan opsi yang tadi kita bahas, Kak."',
    ringkas: 'Kirim informasi yang dijanjikan atau rangkum pilihan dan langkah berikutnya.',
  },
]

export const polaPresentasi = ['Masalah', 'Kebutuhan', 'Solusi', 'Manfaat', 'Closing']

export const alurProductKnowledge = ['Kebutuhan', 'Fitur', 'Manfaat', 'Cek varian']

export const simulasi = {
  judul: 'Simulasi bercabang — Vivobook Go 14',
  pengantar:
    'Customer belum menjelaskan kebutuhannya. Pilih respons yang menurutmu paling tepat. Kalau kurang tepat, kamu dapat umpan balik dan boleh memperbaiki jawaban sebelum lanjut.',
  mulai: 'n1',
  nodes: {
    n1: {
      id: 'n1',
      pembicara: 'customer',
      teks: 'Vivobook Go 14 ini cocok buat gue nggak?',
      catatan: 'Customer baru menyebut nama produk. Pemakaian dan varian belum jelas.',
      pilihan: [
        {
          id: 'n1a',
          teks: '"Cocok, Kak. Langsung ambil aja."',
          nilai: 'kurang',
          umpan:
            'Pemakaian dan varian belum jelas, jadi "cocok" belum punya dasar. Balik ke tahap gali kebutuhan dulu.',
        },
        {
          id: 'n1b',
          teks: '"Rencananya dipakai buat apa, Kak? Ada aplikasi tertentu yang wajib jalan?"',
          nilai: 'tepat',
          umpan:
            'Dua pertanyaan itu membantu memilih hal yang perlu dicek pada varian yang tepat.',
        },
      ],
    },
    n2: {
      id: 'n2',
      pembicara: 'customer',
      teks: 'Buat kuliah, browser banyak tab, dan video call. Gue nemu laptop lain yang lebih murah.',
      catatan: 'Sekarang kebutuhan sudah muncul, dan customer membandingkan dengan produk lain.',
      pilihan: [
        {
          id: 'n2a',
          teks:
            '"Boleh kirim model dan variannya? Gue bandingin RAM, penyimpanan, dan bagian lain yang ngaruh ke kebutuhan Kakak."',
          nilai: 'tepat',
          umpan:
            'Perbandingannya punya dasar dan tetap nyambung dengan penggunaan customer. Varian yang dibandingkan jadi jelas.',
        },
        {
          id: 'n2b',
          teks: '"Yang ini pasti lebih bagus."',
          nilai: 'kurang',
          umpan:
            'Klaimnya belum didukung data kedua varian. Bandingkan hal yang bisa dicek, bukan opini.',
        },
      ],
    },
    n3: {
      id: 'n3',
      pembicara: 'customer',
      teks: 'Garansinya gimana?',
      catatan:
        'Customer menyela di tengah perbandingan. Jawab sesuai informasi yang benar-benar tersedia, lalu sambung alurnya.',
      pilihan: [
        {
          id: 'n3a',
          teks:
            '"Gue cek informasi garansi untuk varian dan penawaran yang Kakak lihat, ya. Boleh kirim tautannya? Tadi kita lagi bandingin opsi buat multitasking kuliah, Kak."',
          nilai: 'tepat',
          umpan:
            'Kamu tidak mengarang isi garansi, jelas apa yang mau dicek, dan menyambung kembali alur perbandingan.',
        },
        {
          id: 'n3b',
          teks: '"Tenang, semua produk di sini resmi dan bergaransi setahun."',
          nilai: 'kurang',
          umpan:
            'Itu menambahkan informasi garansi yang belum kamu pastikan untuk varian tersebut. Cek dulu, baru jawab.',
        },
        {
          id: 'n3c',
          teks: '"Gak tahu, itu urusan teknis. Lanjut aja soal harganya."',
          nilai: 'kurang',
          umpan:
            'Pertanyaan customer diabaikan. Akui apa yang perlu dicek, lalu janjikan tindak lanjut yang jelas.',
        },
      ],
    },
    n4: {
      id: 'n4',
      pembicara: 'customer',
      teks: 'Oke, jadi setelah dua varian itu dibandingin, gue harus gimana?',
      catatan: 'Customer siap diarahkan. Ini momen closing.',
      pilihan: [
        {
          id: 'n4a',
          teks:
            '"Setelah kedua varian dan totalnya jelas, mau gue bantu rangkum perbedaannya biar Kakak gampang milih?"',
          nilai: 'tepat',
          umpan: 'Closing-nya mengarahkan ke satu langkah berikutnya yang konkret dan tidak menekan.',
        },
        {
          id: 'n4b',
          teks: '"Ya terserah Kakak aja."',
          nilai: 'kurang',
          umpan: 'Customer tidak diarahkan. Tawarkan satu langkah berikutnya yang jelas.',
        },
        {
          id: 'n4c',
          teks: '"Kalau gue sih yang ini, percaya gue aja."',
          nilai: 'kurang',
          umpan: 'Rekomendasi tanpa dasar informasi varian. Arahkan ke langkah cek dan perbandingan.',
        },
      ],
    },
    selesai: {
      id: 'selesai',
      pembicara: 'sistem',
      teks:
        'Latihan selesai. Ingat alurnya: gali → konfirmasi → rekomendasikan → jelaskan → tanggapi → closing → tindak lanjuti. Semua langkah yang melibatkan angka atau garansi diselesaikan dengan mengecek varian dan informasi resminya.',
      pilihan: [],
    },
  },
  urutan: { n1: 'n2', n2: 'n3', n3: 'n4', n4: 'selesai' },
}

export const panduanBlank = {
  judul: 'Kalau grogi, keburu cepat, atau ngeblank',
  langkah: [
    'Berhenti sebentar setelah customer selesai bicara.',
    'Ulangi satu kebutuhan utama dengan kalimat pendek.',
    'Pilih satu fitur yang relevan, lalu jelaskan satu manfaat.',
    'Kalau data produk belum ada, sebutkan apa yang perlu dicek dan lanjutkan setelah informasinya ketemu.',
  ],
  ringkas: 'Jeda → ulangi kebutuhan → jelaskan satu manfaat → sebutkan apa yang perlu dicek.',
}

export const latihanBicara = {
  durasiDetik: 90,
  instruksi:
    'Rekam roleplay 90 detik dengan teman sebagai customer. Minta dia menyela dengan pertanyaan harga atau garansi. Mulai dengan dua pertanyaan, ulangi kebutuhan customer, jelaskan satu manfaat, lalu ajak ambil satu langkah berikutnya.',
  rubrik: [
    'Menggali kebutuhan',
    'Mengulang prioritas customer',
    'Menjelaskan satu manfaat',
    'Menjawab sesuai informasi yang tersedia',
    'Menawarkan satu langkah berikutnya',
  ],
  template: 'Karena lu sering …, gue akan cek … supaya …',
}

export const layananHafalan =
  'Sapa → gali → konfirmasi → rekomendasikan → jelaskan → tanggapi → closing → tindak lanjuti.'

export const layananKuis = [
  {
    id: 'p1',
    tipe: 'hafalan',
    soal: 'Urutan delapan tahap pelayanan yang benar?',
    opsi: [
      'Sapa → gali → konfirmasi → rekomendasikan → jelaskan manfaat → tanggapi keberatan → closing → tindak lanjuti.',
      'Sapa → rekomendasikan → gali → closing → konfirmasi → jelaskan → tanggapi → tindak lanjuti.',
      'Gali → sapa → closing → jelaskan → rekomendasikan → tanggapi → konfirmasi → tindak lanjuti.',
      'Sapa → gali → closing → tanggapi → jelaskan → rekomendasikan → konfirmasi → tindak lanjuti.',
    ],
    kunci: 0,
    pembahasan:
      'Hafalan: Sapa → gali → konfirmasi → rekomendasikan → jelaskan → tanggapi → closing → tindak lanjuti.',
  },
  {
    id: 'p2',
    tipe: 'kasus',
    soal: 'Customer: "Vivobook Go 14 ini cocok buat gue nggak?" Respons mana yang paling tepat?',
    opsi: [
      '"Cocok, Kak. Langsung ambil aja."',
      '"Rencananya dipakai buat apa, Kak? Ada aplikasi tertentu yang wajib jalan?"',
      '"Semua laptop di sini bagus, tinggal pilih warnanya."',
      '"Saya bukan sales, coba tanya yang lain."',
    ],
    kunci: 1,
    pembahasan:
      'Pemakaian dan varian belum jelas. Dua pertanyaan itu membantu memilih hal yang perlu dicek.',
  },
  {
    id: 'p3',
    tipe: 'kasus',
    soal: 'Customer bilang sudah menemukan laptop lain yang lebih murah. Respons yang benar?',
    opsi: [
      '"Yang ini pasti lebih bagus."',
      '"Boleh kirim model dan variannya? Gue bandingin RAM, penyimpanan, dan bagian lain yang ngaruh ke kebutuhan Kakak."',
      '"Ya kalau mau murah, silakan ambil yang itu."',
      '"Harga mahal itu tanda kualitas."',
    ],
    kunci: 1,
    pembahasan:
      'Perbandingan perlu dasar: varian yang jelas dan aspek yang relevan dengan kebutuhan customer.',
  },
  {
    id: 'p4',
    tipe: 'kasus',
    soal: 'Customer menyela di tengah perbandingan: "Garansinya gimana?" Langkah paling tepat?',
    opsi: [
      '"Semua produk resmi bergaransi setahun."',
      '"Gue cek informasi garansi untuk varian dan penawaran yang Kakak lihat, ya. Boleh kirim tautannya?" lalu sambung lagi alur perbandingannya.',
      '"Gak tahu, itu urusan teknis."',
      '"Nanti aja kita bahas setelah bayar."',
    ],
    kunci: 1,
    pembahasan:
      'Jangan menambahkan informasi garansi yang belum diketahui. Cek dulu, lalu sambung kembali percakapan.',
  },
  {
    id: 'p5',
    tipe: 'hafalan',
    soal: 'Kamu tiba-tiba ngeblank di tengah presentasi. Empat langkah pemulihannya?',
    opsi: [
      'Bicara lebih cepat, ulangi harga, tutup dengan permintaan maaf.',
      'Jeda sebentar, ulangi satu kebutuhan utama, pilih satu fitur lalu jelaskan satu manfaat, sebutkan apa yang perlu dicek.',
      'Diam sampai customer bertanya lagi.',
      'Alihkan ke produk lain yang paling mahal.',
    ],
    kunci: 1,
    pembahasan:
      'Jeda, ulangi kebutuhan, satu fitur satu manfaat, lalu sebutkan data yang masih perlu dicek.',
  },
  {
    id: 'p6',
    tipe: 'hafalan',
    soal: 'Apa tujuan tahap konfirmasi?',
    opsi: [
      'Menekan customer supaya cepat membeli.',
      'Pastikan pemahaman sales sama dengan maksud customer, dengan mengulang kebutuhan secara singkat.',
      'Menyebut semua spesifikasi produk satu per satu.',
      'Membandingkan harga dengan kompetitor.',
    ],
    kunci: 1,
    pembahasan:
      'Konfirmasi memberi customer ruang mengoreksi sebelum rekomendasi diberikan.',
  },
  {
    id: 'p7',
    tipe: 'hafalan',
    soal: 'Pola presentasi yang dipakai di materi pelayanan?',
    opsi: [
      'Fitur → harga → diskon → closing.',
      'Masalah → kebutuhan → solusi → manfaat → closing.',
      'Sapa → harga → garansi → bayar.',
      'Produk → merek → stok → closing.',
    ],
    kunci: 1,
    pembahasan:
      'Pola yang tercatat: masalah → kebutuhan → solusi → manfaat → closing.',
  },
  {
    id: 'p8',
    tipe: 'kasus',
    soal: 'Penilaian mandiri latihan roleplay 90 detik memakai lima poin. Mana yang BUKAN bagian dari lima poin itu?',
    opsi: [
      'Menggali kebutuhan.',
      'Mengulang prioritas customer.',
      'Menjelaskan satu manfaat.',
      'Menyebut harga termurah di pasaran.',
    ],
    kunci: 3,
    pembahasan:
      'Lima poinnya: menggali kebutuhan, mengulang prioritas, menjelaskan satu manfaat, menjawab sesuai informasi yang tersedia, dan menawarkan satu langkah berikutnya.',
  },
]
