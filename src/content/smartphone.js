// Hari 2 · 10 November — Smartphone
// Sumber: Rangkuman-Training-AGRES-ID.md. Jangan menambah spesifikasi/harga/stok/garansi yang tidak tercatat.

export const hpKomponen = [
  {
    id: 'chipset',
    nama: 'Chipset (SoC)',
    singkat: 'Memproses kerja perangkat',
    fungsi:
      'Menggabungkan beberapa bagian pemrosesan, termasuk CPU dan GPU, dalam satu chip.',
    caraBaca:
      'Kenali modelnya. Kalau customer minta perbandingan performa, sesuaikan dengan aplikasi dan pemakaian yang dimaksud.',
    tanya: '"Game atau aplikasi apa yang paling sering lu pakai?"',
    manfaat: 'Buat gaming, tanyakan game yang dimainkan dan cek chipset varian yang dibandingkan.',
  },
  {
    id: 'ram',
    nama: 'RAM',
    singkat: 'Menampung data sementara',
    fungsi: 'Menampung data sementara saat aplikasi berjalan.',
    caraBaca:
      'Cek kapasitas RAM fisik. Bila ada angka tambahan dari penyimpanan, jelaskan sesuai informasi varian.',
    tanya: '"Biasanya sering pindah antara aplikasi apa aja?"',
    manfaat: 'Kalau customer sering pindah aplikasi, cek RAM fisik pada varian yang dimaksud.',
  },
  {
    id: 'penyimpanan',
    nama: 'Penyimpanan internal',
    singkat: 'Menyimpan aplikasi dan file',
    fungsi: 'Menyimpan aplikasi, foto, video, dan file.',
    caraBaca:
      'Periksa kapasitas internal dan dukungan penyimpanan tambahan bila dibutuhkan.',
    tanya: '"Foto dan video biasanya disimpan lama di HP atau rutin dipindah?"',
    manfaat:
      'Kalau sering rekam video, tanyakan kebiasaan menyimpan atau memindahkan file.',
  },
  {
    id: 'layar',
    nama: 'Layar',
    singkat: 'Menampilkan gambar dan menerima sentuhan',
    fungsi:
      'Menampilkan gambar dan menerima sentuhan. Refresh rate menunjukkan seberapa sering layar bisa memperbarui gambar.',
    caraBaca:
      'Baca ukuran, resolusi, dan refresh rate sesuai prioritas pemakaian. Untuk penggunaan luar ruangan, cek informasi keterbacaan yang relevan.',
    tanya: '"Lebih sering dipakai di luar ruangan atau di dalam?"',
    manfaat:
      'Kalau sering dipakai di luar, gali kebutuhan keterbacaan layar di tempat terang.',
  },
  {
    id: 'kamera',
    nama: 'Kamera',
    singkat: 'Menangkap foto dan video',
    fungsi:
      'Menangkap foto dan video. Hasilnya dipengaruhi sensor, lensa, pemrosesan, dan kondisi cahaya.',
    caraBaca:
      'Baca fungsi kamera yang tersedia. Untuk menilai hasil, lihat contoh foto atau video dalam kondisi yang mendekati penggunaan customer.',
    tanya: '"Buat foto barang di meja, rekam video, atau sering foto malam?"',
    manfaat:
      'Kalau buat foto produk, tanyakan kondisi cahaya dan cek contoh hasil yang relevan.',
  },
  {
    id: 'baterai',
    nama: 'Baterai dan pengisian daya',
    singkat: 'Memberi daya dan mengatur pengisian',
    fungsi:
      'Baterai menyuplai daya. Sistem pengisian mengatur cara daya masuk.',
    caraBaca:
      'Cek kapasitas, dukungan pengisian, dan aksesori yang diperlukan untuk mencapai kecepatan yang disebut.',
    tanya: '"Biasanya ada waktu isi daya di tengah hari?"',
    manfaat:
      'Kalau sering mobile, cek kebutuhan durasi dan dukungan pengisian di varian tersebut.',
  },
  {
    id: 'konektivitas',
    nama: 'Konektivitas',
    singkat: 'Menghubungkan HP ke jaringan dan perangkat',
    fungsi:
      'Menghubungkan HP ke jaringan dan perangkat, misalnya lewat seluler, Wi-Fi, dan Bluetooth.',
    caraBaca: 'Cek fitur yang benar-benar dipakai, termasuk jaringan atau sambungan ke aksesori.',
    tanya: '"Ada kebutuhan khusus seperti 5G, NFC, atau sambungan ke aksesori tertentu?"',
    manfaat:
      'Kalau 5G atau NFC penting buat customer, cek dukungan fitur di varian yang akan dibeli.',
  },
]

export const hpPendalaman = {
  judul: 'Bedah kebutuhan smartphone',
  pembuka:
    'Kalimat "HP yang bagus" bisa berarti hasil foto yang enak dilihat, lancar buat game, atau nyaman buat kerja seharian. Tanyakan aktivitas yang paling sering dilakukan, masalah di HP lama, dan dua prioritas customer.',
}

export const hpKasus = [
  {
    id: 'hp-konten',
    judul: 'Jualan online dan bikin konten',
    isi: 'Customer jualan online dan bikin konten. Kondisi cahaya saat memotret barang, seberapa sering merekam, dan kebutuhan penyimpanan belum jelas.',
    tanya: [
      'Foto produknya diambil di kondisi cahaya seperti apa?',
      'Seberapa sering merekam video?',
      'File disimpan lama di HP atau rutin dipindah?',
    ],
    jelaskan:
      'Kaitkan kamera dengan kondisi cahaya tempat jualan, dan penyimpanan dengan kebiasaan menyimpan file.',
  },
  {
    id: 'hp-gaming',
    judul: 'Main game dan sering pindah aplikasi',
    isi: 'Customer main game, lalu sering berpindah ke chat dan media sosial.',
    tanya: [
      'Game apa yang paling sering dimainkan?',
      'Sering pindah aplikasi saat main?',
      'Lebih sering di dalam atau di luar ruangan?',
    ],
    jelaskan:
      'Bandingkan chipset, RAM, dan layar berdasarkan kebutuhan itu. Saat menjelaskan layar, bedakan refresh rate panel dari jumlah frame yang bisa dihasilkan game.',
  },
  {
    id: 'hp-luar',
    judul: 'Sering di luar dan jarang dekat colokan',
    isi: 'Customer kerja lapangan, seharian di luar ruangan, jarang ada kesempatan mengisi daya.',
    tanya: [
      'Rata-rata berapa jam di luar ruangan?',
      'Butuh jaringan khusus atau tidak?',
      'Sering buka layar di tempat terang?',
    ],
    jelaskan:
      'Bahas baterai dan pengisian dengan konteks pemakaian yang sama, bukan angka jam pakai yang belum jelas dasarnya.',
  },
]

export const hpLatihan = [
  {
    soal: 'Customer bilang kameranya harus bagus.',
    jawab:
      'Tanya objek yang difoto dan kondisi cahayanya. Dua pertanyaan itu membantu memilih contoh hasil foto yang relevan.',
  },
  {
    soal: 'Customer fokus pada angka megapiksel.',
    jawab:
      'Jelaskan bahwa megapiksel menggambarkan jumlah piksel. Sensor, lensa, pemrosesan, dan cahaya juga memengaruhi hasil.',
  },
  {
    soal: 'Customer nanya bisa NFC atau enggak, tapi modelnya belum jelas.',
    jawab: 'Minta nama atau tautan varian. Cek dukungannya sebelum menjawab.',
  },
  {
    soal: 'Latihan ngomong: beri rekomendasi pakai pola "Karena lu sering …, gue akan cek … supaya …".',
    jawab:
      'Contoh: "Karena lu sering rekam video produk, gue akan cek penyimpanan dan contoh hasil videonya supaya sesuai sama cara lu bikin konten."',
  },
]

export const hpLatihanSingkat = {
  skenario:
    'Customer cari HP buat jualan online dan sering foto produk. Pilih dua aspek yang akan kamu bahas.',
  contoh: [
    'Kamera untuk kondisi cahaya tempat jualan.',
    'Penyimpanan untuk menampung foto dan video.',
  ],
}

export const hpHafalan =
  'Chipset memproses, RAM menampung kerja, penyimpanan menyimpan file, layar menampilkan, kamera merekam, baterai memberi daya, konektivitas menghubungkan.'

export const hpKuis = [
  {
    id: 'h1',
    tipe: 'hafalan',
    soal: 'Customer fokus pada angka megapiksel kamera. Penjelasan mana yang paling tepat?',
    opsi: [
      'Megapiksel paling besar selalu menghasilkan foto paling bagus.',
      'Megapiksel menggambarkan jumlah piksel. Sensor, lensa, pemrosesan, dan cahaya juga memengaruhi hasil.',
      'Megapiksel cuma soal ukuran file, tidak ada hubungannya dengan foto.',
      'Megapiksel menentukan kecepatan pengisian daya.',
    ],
    kunci: 1,
    pembahasan:
      'Hasil foto dipengaruhi sensor, lensa, pemrosesan, dan kondisi cahaya — bukan angka megapiksel saja.',
  },
  {
    id: 'h2',
    tipe: 'hafalan',
    soal: 'Customer bilang "refresh rate-nya tinggi, berarti game-nya pasti lancar 120 fps". Tanggapan yang benar?',
    opsi: [
      'Benar, refresh rate dan frame rate itu sama.',
      'Refresh rate panel dan jumlah frame yang bisa dihasilkan game itu dua hal berbeda; keduanya perlu dicek sesuai kebutuhan.',
      'Salah total, refresh rate tidak berpengaruh apa-apa.',
      'Frame rate cuma ditentukan ukuran layar.',
    ],
    kunci: 1,
    pembahasan:
      'Refresh rate adalah kemampuan layar memperbarui gambar; frame rate bergantung pada perangkat dan game-nya.',
  },
  {
    id: 'h3',
    tipe: 'kasus',
    soal: 'Customer tanya "HP ini bisa NFC nggak?" tapi modelnya belum disebut. Apa yang kamu lakukan?',
    opsi: [
      'Jawab bisa, karena hampir semua HP sekarang ada NFC.',
      'Jawab tidak bisa, supaya aman.',
      'Minta nama atau tautan varian, lalu cek dukungannya sebelum menjawab.',
      'Alihkan pembicaraan ke kamera.',
    ],
    kunci: 2,
    pembahasan:
      'Dukungan fitur dicek di varian yang tepat. Jangan menjawab sebelum modelnya jelas.',
  },
  {
    id: 'h4',
    tipe: 'kasus',
    soal: 'Customer jualan online dan sering foto produk. Apa dua aspek yang paling masuk akal dibahas lebih dulu?',
    opsi: [
      'Kamera untuk kondisi cahaya tempat jualan, dan penyimpanan untuk menampung foto serta video.',
      'Warna bodi dan berat perangkat.',
      'Jumlah SIM slot dan merek charger.',
      'Refresh rate dan NFC.',
    ],
    kunci: 0,
    pembahasan:
      'Kebutuhan foto produk mengarah ke kamera (dengan konteks cahaya) dan penyimpanan untuk file.',
  },
  {
    id: 'h5',
    tipe: 'kasus',
    soal: 'Customer main game dan sering pindah aplikasi. Komponen apa yang relevan dibandingkan?',
    opsi: [
      'Kamera dan konektivitas.',
      'Chipset, RAM, dan layar.',
      'Baterai dan jumlah kamera.',
      'Penyimpanan tambahan saja.',
    ],
    kunci: 1,
    pembahasan:
      'Performa game dan perpindahan aplikasi berkaitan dengan chipset, RAM, dan layar.',
  },
  {
    id: 'h6',
    tipe: 'kasus',
    soal: 'Customer sering rekam video produk. Pertanyaan yang paling membantu?',
    opsi: [
      '"Mau warna apa?"',
      '"Foto dan video biasanya disimpan lama di HP atau rutin dipindah?"',
      '"Suka main game apa?"',
      '"Pakai jaringan 5G nggak?"',
    ],
    kunci: 1,
    pembahasan:
      'Kebiasaan menyimpan file menentukan seberapa besar kapasitas penyimpanan yang masuk akal.',
  },
  {
    id: 'h7',
    tipe: 'hafalan',
    soal: 'Pasangan komponen smartphone dan fungsi mana yang SALAH?',
    opsi: [
      'Chipset — menggabungkan beberapa bagian pemrosesan termasuk CPU dan GPU.',
      'Layar — menampilkan gambar dan menerima sentuhan.',
      'RAM — menyimpan foto dan video secara permanen.',
      'Konektivitas — menghubungkan HP ke jaringan dan perangkat.',
    ],
    kunci: 2,
    pembahasan:
      'RAM menampung data sementara saat aplikasi berjalan. Foto dan video disimpan di penyimpanan.',
  },
  {
    id: 'h8',
    tipe: 'kasus',
    soal: 'Customer kerja lapangan, seharian di luar, jarang dekat colokan. Cara membahas baterai yang benar?',
    opsi: [
      'Sebut angka jam pakai paling tinggi yang pernah kamu dengar.',
      'Bahas baterai dan pengisian dengan konteks pemakaian customer, dan hindari janji durasi tanpa dasar.',
      'Bilang baterai tidak penting karena bisa bawa powerbank.',
      'Langsung pindah ke topik kamera.',
    ],
    kunci: 1,
    pembahasan:
      'Durasi pakai dipengaruhi aplikasi dan pengaturan. Klaim harus punya dasar, bukan perkiraan.',
  },
]
