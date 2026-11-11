// Hari 1 · 9 November — Laptop
// Sumber: Rangkuman-Training-AGRES-ID.md. Jangan menambah spesifikasi, harga, stok, atau garansi yang tidak ada di file.

export const laptopKomponen = [
  {
    id: 'cpu',
    nama: 'Prosesor (CPU)',
    singkat: 'Menjalankan instruksi aplikasi',
    fungsi:
      'Menjalankan instruksi aplikasi. GHz menunjukkan frekuensi kerja, sementara keluarga prosesor seperti Intel Core atau AMD Ryzen mencakup banyak model.',
    caraBaca:
      'CPU menangani pekerjaan aplikasi. GHz adalah frekuensi kerja, sehingga angka ini perlu dibaca bersama model dan generasi CPU.',
    manfaat:
      'Kalau customer sering pakai spreadsheet besar, cek model CPU dan aplikasi yang dipakai sebelum membandingkan.',
    cek: 'Nama CPU lengkap, aplikasi utama, dan kebutuhan aplikasi tersebut.',
  },
  {
    id: 'gpu',
    nama: 'GPU',
    singkat: 'Mengolah grafis',
    fungsi:
      'Mengolah grafis. GPU terintegrasi menyatu dengan prosesor dan biasanya memakai RAM sistem. GPU dedicated memakai chip grafis tersendiri.',
    caraBaca:
      'GPU membantu mengolah visual. Kebutuhannya bergantung pada game, aplikasi, dan target penggunaan.',
    manfaat:
      'Kalau customer mau gaming, tanyakan judul game dan cek kebutuhan grafisnya.',
    cek: 'GPU pada varian tepat dan kebutuhan grafis aplikasi atau game.',
  },
  {
    id: 'ram',
    nama: 'RAM',
    singkat: 'Ruang kerja sementara aplikasi',
    fungsi: 'Ruang kerja sementara buat aplikasi yang sedang berjalan.',
    caraBaca:
      'RAM memberi ruang kerja sementara saat beberapa aplikasi dibuka bersamaan.',
    manfaat:
      'Kalau customer sering buka browser, meeting, dan spreadsheet bersamaan, cek kapasitas RAM dan opsi upgrade untuk varian itu.',
    cek: 'Kapasitas bawaan, RAM tertanam atau memakai slot, dan opsi upgrade yang benar-benar didukung.',
  },
  {
    id: 'penyimpanan',
    nama: 'Penyimpanan',
    singkat: 'Menyimpan sistem, aplikasi, dan file',
    fungsi:
      'Menyimpan sistem, aplikasi, dan file. SSD memakai penyimpanan berbasis chip.',
    caraBaca:
      'Penyimpanan menampung file dan aplikasi. Kapasitas menentukan seberapa banyak yang bisa disimpan.',
    manfaat:
      'Tanyakan berapa banyak file yang biasa disimpan supaya rekomendasi kapasitasnya masuk akal.',
    cek: 'Jenis drive, kapasitas, dan dukungan slot tambahan jika ditanya.',
  },
  {
    id: 'layar',
    nama: 'Layar',
    singkat: 'Menampilkan gambar',
    fungsi:
      'Menampilkan gambar. Resolusi menunjukkan jumlah piksel dan jenis panel memengaruhi karakter tampilan.',
    caraBaca:
      'Ukuran fisik dan resolusi memengaruhi ruang tampilan. Jenis panel memberi konteks untuk kualitas tampilan.',
    manfaat:
      'Kalau dipakai buat kerja dokumen, gali kebutuhan ruang tampilan dan kenyamanan baca.',
    cek: 'Ukuran dan resolusi varian, plus aspek yang penting buat customer seperti kenyamanan baca.',
  },
  {
    id: 'baterai',
    nama: 'Baterai',
    singkat: 'Menyuplai daya saat lepas charger',
    fungsi: 'Menyuplai daya saat laptop lepas dari charger.',
    caraBaca:
      'Kapasitas memberi gambaran energi yang tersimpan. Durasi pakai juga dipengaruhi aplikasi dan pengaturan.',
    manfaat:
      'Kalau customer sering kerja di luar, gali durasi pemakaian dan hindari menjanjikan jam pakai tanpa dasar.',
    cek: 'Pola penggunaan customer dan kondisi pengujian bila mengutip estimasi daya tahan.',
  },
  {
    id: 'motherboard',
    nama: 'Motherboard',
    singkat: 'Menghubungkan komponen',
    fungsi: 'Papan utama yang menghubungkan komponen.',
    caraBaca:
      'Papan utama menentukan sambungan dan kompatibilitas komponen internal.',
    manfaat:
      'Kalau customer bertanya soal upgrade, cek slot dan dukungan pada varian yang tepat.',
    cek: 'Slot serta dukungan upgrade untuk model dan varian yang dimaksud.',
  },
  {
    id: 'pendingin',
    nama: 'Sistem pendingin',
    singkat: 'Membantu membuang panas',
    fungsi: 'Membantu membuang panas dari komponen.',
    caraBaca:
      'Pendinginan membantu mengelola panas saat perangkat bekerja, terutama ketika beban berlangsung lama.',
    manfaat:
      'Kalau customer sering menjalankan pekerjaan berat dalam waktu lama, jadikan pendinginan salah satu bahan perbandingan.',
    cek: 'Pola kerja customer. Jika membandingkan performa berkelanjutan, pakai hasil uji yang relevan bila tersedia.',
  },
  {
    id: 'port',
    nama: 'Port',
    singkat: 'Sambungan ke perangkat lain',
    fungsi: 'Sambungan fisik buat charger, monitor, dan perangkat lain.',
    caraBaca:
      'Bentuk konektor membantu mengenali sambungan, sementara fungsi port menentukan perangkat yang bisa dipakai.',
    manfaat:
      'Kalau customer punya monitor eksternal, cek jenis port dan dukungan output video.',
    cek: 'Sambungan monitor atau aksesori customer dan dukungan fungsi yang dibutuhkan pada port laptop.',
  },
]

export const laptopPendalaman = {
  judul: 'Baca spesifikasi laptop seperti sales',
  pembuka:
    'Mulai dari tiga pertanyaan. Dipakai buat apa, aplikasi apa yang paling berat, dan berapa budget-nya? Kalau customer menyebut "laptop cepat", cari tahu bagian mana yang selama ini terasa lambat. Lama buka aplikasi, tersendat ketika pindah aplikasi, dan game patah-patah bisa mengarah ke pemeriksaan yang berbeda.',
}

export const laptopKasus = [
  {
    id: 'kasus-mahasiswa',
    judul: 'Mahasiswa sering video call sambil buka dokumen',
    isi: 'Mahasiswa sering video call sambil buka dokumen. Aplikasi kuliah yang dipakai, kebiasaan multitasking, dan apakah laptop sering dibawa belum jelas.',
    tanya: [
      'Aplikasi kuliah apa yang paling sering dipakai?',
      'Biasanya berapa aplikasi terbuka bersamaan?',
      'Seberapa sering laptop dibawa berpindah tempat?',
    ],
    jelaskan:
      'Kaitkan RAM dengan aplikasi yang terbuka bersamaan, lalu kaitkan ukuran layar dan baterai dengan pemakaian berpindah tempat.',
  },
  {
    id: 'kasus-finance',
    judul: 'Staf finance pakai spreadsheet besar dan monitor kantor',
    isi: 'Customer kerja finance, sering buka banyak tab, dan sudah punya monitor tambahan di kantor.',
    tanya: [
      'Spreadsheet-nya biasa sebesar apa?',
      'Monitor tambahannya pakai sambungan apa?',
      'Aplikasi apa lagi yang jalan bersamaan?',
    ],
    jelaskan:
      'Cek CPU, RAM, dan dukungan output video. Kalau customer belum tahu konektornya, minta nama model monitor atau foto port.',
  },
  {
    id: 'kasus-gaming',
    judul: 'Customer mencari laptop gaming',
    isi: 'Customer minta laptop buat main game, tapi belum jelas game apa dan seberapa berat targetnya.',
    tanya: [
      'Game apa yang paling sering dimainkan?',
      'Target kualitas visualnya seperti apa?',
      'Laptop ini juga dipakai buat kuliah atau kerja?',
    ],
    jelaskan:
      'Cek kebutuhan game, lalu bandingkan GPU dan CPU dari varian yang sedang dibahas. Jangan menilai dari nama keluarga prosesor saja.',
  },
]

export const laptopLatihan = [
  {
    soal: '"RAM besar bikin file muat lebih banyak?"',
    jawab:
      'File tersimpan di SSD atau media penyimpanan lain. RAM dipakai ketika sistem dan aplikasi sedang bekerja.',
  },
  {
    soal: '"Dua laptop sama-sama Intel Core. Berarti performanya setara?"',
    jawab:
      'Cek model dan generasi CPU, konfigurasi, serta beban kerja yang mau dibandingkan.',
  },
  {
    soal: '"Ada USB-C, berarti bisa disambung ke monitor?"',
    jawab:
      'Cek apakah port tersebut mendukung output video dan sambungan yang dimiliki monitor.',
  },
  {
    soal: 'Latihan ngomong: jelaskan beda RAM dan SSD dalam dua kalimat.',
    jawab:
      'Contoh: "RAM itu ruang kerja saat aplikasi lagi dibuka. SSD itu tempat aplikasi dan file lu disimpan."',
  },
]

export const laptopLatihanSingkat = {
  skenario:
    'Customer bilang: "Gue kerja finance, sering buka banyak tab, dan punya monitor tambahan." Sebutkan dua pertanyaan sebelum merekomendasikan.',
  contoh: ['"Spreadsheet-nya biasa sebesar apa?"', '"Monitor lu pakai sambungan apa?"'],
}

export const laptopHafalan =
  'CPU kerja, GPU grafis, RAM ruang kerja, SSD simpan, layar tampil, baterai daya, motherboard hubungkan, pendingin buang panas, port sambungkan perangkat.'

export const laptopKuis = [
  {
    id: 'l1',
    tipe: 'hafalan',
    soal: 'Customer bilang, "RAM besar bikin file muat lebih banyak." Jawaban mana yang paling tepat?',
    opsi: [
      'Benar, RAM menyimpan semua file supaya cepat dibuka.',
      'File tersimpan di SSD atau media penyimpanan lain. RAM dipakai saat sistem dan aplikasi sedang bekerja.',
      'Benar, RAM dan SSD itu sama saja, cuma beda nama.',
      'RAM cuma berpengaruh buat game, bukan buat file.',
    ],
    kunci: 1,
    pembahasan:
      'RAM adalah ruang kerja sementara saat aplikasi berjalan. File tersimpan di penyimpanan seperti SSD.',
  },
  {
    id: 'l2',
    tipe: 'hafalan',
    soal: 'Dua laptop sama-sama pakai Intel Core. Apakah performanya pasti setara?',
    opsi: [
      'Pasti setara, karena nama keluarganya sama.',
      'Setara kalau RAM-nya sama, CPU tidak terlalu penting.',
      'Belum tentu. Cek model dan generasi CPU, konfigurasi, serta beban kerja yang mau dibandingkan.',
      'Tidak bisa dibandingkan sama sekali, jadi jangan dijawab.',
    ],
    kunci: 2,
    pembahasan:
      'Keluarga prosesor mencakup banyak model. Angka dan model lengkap perlu dibaca bersama generasi CPU dan konfigurasi lainnya.',
  },
  {
    id: 'l3',
    tipe: 'hafalan',
    soal: 'Customer bertanya, "Laptop ini ada USB-C, berarti bisa ke monitor kan?"',
    opsi: [
      'Iya, semua USB-C pasti bisa output video.',
      'Tidak bisa, harus HDMI.',
      'Cek dulu apakah port itu mendukung output video dan monitor customer pakai sambungan apa.',
      'Bisa, asal kabelnya mahal.',
    ],
    kunci: 2,
    pembahasan:
      'Fungsi port yang perlu dicek, bukan bentuk konektornya saja. Sambungan monitor customer juga menentukan.',
  },
  {
    id: 'l4',
    tipe: 'kasus',
    soal: 'Mahasiswa sering video call sambil buka materi, laptopnya juga sering dibawa. Komponen apa yang paling relevan dibahas?',
    opsi: [
      'RAM untuk aplikasi yang terbuka bersamaan, plus layar dan baterai untuk pemakaian berpindah tempat.',
      'GPU dedicated dan RGB keyboard.',
      'Motherboard dan jumlah slot RAM saja.',
      'Hanya kapasitas SSD.',
    ],
    kunci: 0,
    pembahasan:
      'Kasus ini soal multitasking ringan dan mobilitas. RAM, kenyamanan layar, dan baterai yang masuk akal dibahas.',
  },
  {
    id: 'l5',
    tipe: 'kasus',
    soal: 'Staf finance pakai spreadsheet besar dan monitor kantor. Apa yang wajib dicek sebelum merekomendasikan?',
    opsi: [
      'Warna bodi laptop dan beratnya.',
      'CPU, RAM, dan dukungan output video ke monitor.',
      'Hanya harga termurah di daftar.',
      'Jumlah kamera dan mikrofon.',
    ],
    kunci: 1,
    pembahasan:
      'Spreadsheet besar dan monitor eksternal mengarah ke CPU, RAM, dan dukungan output video.',
  },
  {
    id: 'l6',
    tipe: 'kasus',
    soal: 'Customer minta laptop gaming. Apa langkah pertama yang benar?',
    opsi: [
      'Langsung sebut laptop paling mahal di daftar.',
      'Bilang semua laptop gaming sama saja.',
      'Tanya judul game, target kualitas visual, dan apakah dipakai buat kuliah atau kerja juga.',
      'Tanya warna favoritnya dulu.',
    ],
    kunci: 2,
    pembahasan:
      'Kebutuhan grafis bergantung pada game dan target visualnya. Pemakaian lain juga mempengaruhi rekomendasi.',
  },
  {
    id: 'l7',
    tipe: 'hafalan',
    soal: 'Customer bilang cuma butuh "laptop cepat". Apa yang sebaiknya kamu lakukan?',
    opsi: [
      'Rekomendasikan yang paling mahal supaya aman.',
      'Cari tahu bagian mana yang selama ini terasa lambat, aplikasi apa yang paling berat, dan budget-nya.',
      'Sebut angka GHz paling besar dan selesai.',
      'Tanya merk favoritnya saja.',
    ],
    kunci: 1,
    pembahasan:
      'Lama buka aplikasi, tersendat saat pindah aplikasi, dan game patah-patah mengarah ke pemeriksaan yang berbeda.',
  },
  {
    id: 'l8',
    tipe: 'hafalan',
    soal: 'Pasangan komponen dan fungsi mana yang SALAH?',
    opsi: [
      'Pendingin — membantu membuang panas dari komponen.',
      'Motherboard — papan utama yang menghubungkan komponen.',
      'RAM — menyimpan sistem operasi secara permanen.',
      'Port — sambungan fisik buat charger, monitor, dan perangkat lain.',
    ],
    kunci: 2,
    pembahasan:
      'RAM adalah ruang kerja sementara. Yang menyimpan sistem operasi secara permanen adalah penyimpanan.',
  },
]
