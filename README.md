# Belajar AGRES.ID

Website belajar interaktif berbahasa Indonesia dari *Rangkuman Training AGRES.ID, 9–11 November 2026*.
Dipakai untuk belajar ulang product knowledge **dan** latihan ngomong sebagai sales online.

Isi materi: laptop (Hari 1), smartphone (Hari 2), pelayanan penjualan (Hari 3).

## Alur belajar

Tiap hari punya empat langkah: **Pelajari → Praktik → Kuis → Review**. Penjelasan inti ada di tampilan awal,
materi pendalaman dibuka saat dipilih, jadi bisa belajar singkat atau mendalami satu topik.

| Hari | Materi | Praktik |
| --- | --- | --- |
| 1 · 9 Nov | 9 komponen laptop, cara baca spesifikasi, 3 kasus customer | Bedah 3D (9 titik), game mencocokkan, latihan 3 kasus |
| 2 · 10 Nov | 7 komponen smartphone, bedah per lapisan, 3 kasus pemakaian | Bedah 3D (7 titik + buka lapisan), game mencocokkan, latihan 3 kasus |
| 3 · 11 Nov | 8 tahap pelayanan, pola presentasi | Urutkan 8 tahap, simulasi chat bercabang Vivobook Go 14, timer ngomong 90 detik + penilaian mandiri 5 poin, panduan saat ngeblank |

Fitur lain:

- **Kuis per hari** gabungan hafalan + studi kasus, dengan skor, pembahasan, dan opsi mengulang soal yang salah.
- **Game mencocokkan** komponen dengan fungsi/manfaatnya; bisa tap, klik, dan keyboard (Tab + Enter/Spasi).
- **Progres** (bagian selesai, skor terbaik, modul terakhir) disimpan di `localStorage` browser — tanpa login, tanpa backend.
- **Hafalan gabungan** di `/review` yang bisa dibuka kapan saja tanpa mengubah progres.
- **Tampilan 3D dan 2D** dengan materi serta latihan yang sama. 3D dimuat hanya saat adegan dibuka,
  dan animasi/auto-rotate dimatikan kalau perangkat meminta `prefers-reduced-motion`.
- Halaman modul bisa dibuka langsung (`/hari/1`, `/hari/2`, `/hari/3`) dan tetap jalan setelah dimuat ulang.

## Teknologi

- Vite + React 19 (JavaScript, tanpa backend, output statis)
- three.js untuk scene 3D (tanpa `@react-three/fiber`)
- react-router-dom (BrowserRouter + `public/_redirects` untuk SPA fallback)

## Menjalankan lokal

Butuh **Node 22** (Vite 7 mensyaratkan `^20.19.0 || >=22.12.0`, dan `qa.mjs` memakai `WebSocket` global yang baru ada di Node ≥ 22).

```bash
npm ci          # pasang dependency sesuai package-lock.json
npm run dev     # server pengembangan
npm run build   # build produksi -> folder dist/
npm run preview # cek hasil build
```

`npm ci && npm run build` sudah diuji dari kondisi bersih dan menghasilkan `dist/`.

## Uji otomatis

`qa.mjs` menjalankan pengujian end-to-end lewat Chrome DevTools Protocol: alur kuis sampai hasil,
game mencocokkan 9 pasangan, urutan 8 tahap, simulasi chat sampai selesai, timer, progres setelah reload,
tampilan 2D, panel komponen (fokus keyboard), dan pemeriksaan overflow horizontal di lebar 390px.

```bash
npm run build
npx vite preview --port 4173 &

# Chrome headless dengan remote debugging (path native Windows untuk --user-data-dir)
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-first-run \
  --remote-debugging-port=9333 --user-data-dir="C:/Users/<nama>/AppData/Local/Temp/cprof-qa" about:blank &

node qa.mjs http://localhost:4173 9333
```

Catatan: skrip ini menempel ke **tab page pertama** yang terbuka di Chrome tersebut, jadi jalankan Chrome
khusus uji (profil terpisah) supaya tidak menabrak tab lain. Kalau ada pemeriksaan gagal karena halaman
belum selesai dimuat, jalankan ulang — skrip menunggu selektor penting, tapi headless pertama kadang lambat.

## Deploy ke Cloudflare Pages

1. Push repo ini ke GitHub (branch produksi: `main`).
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pilih repo.
3. Isi konfigurasi build:
   - **Production branch**: `main`
   - **Framework preset**: Vite (atau None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
   - Environment variable: `NODE_VERSION=22` — **wajib**, karena Vite 7 tidak jalan di Node 18/20 lama
4. Deploy. `public/_redirects` berisi `/* /index.html 200` supaya `/hari/1` dan `/review` bisa dibuka
   langsung dan tidak 404 setelah reload.

## Struktur

```
index.html
src/
  main.jsx  App.jsx  ProgressContext.jsx
  content/        laptop.js · smartphone.js · service.js · index.js  (seluruh materi, kuis, simulasi)
  pages/          Home.jsx · DayPage.jsx · ReviewPage.jsx
  components/     ScenePanel · Quiz · MatchingGame · CasePractice · StageOrder
                  ChatSimulation · SpeakingTimer · BlankGuide · ProgressRing · Layout
  three/          LaptopScene.jsx · PhoneScene.jsx (three.js, lazy-loaded)
  hooks/          useProgress.js (localStorage)
  styles/         tokens.css · app.css
public/_redirects
qa.mjs            pengujian end-to-end via CDP
docs/DESIGN.md    spesifikasi desain & aksesibilitas
```

## Catatan akurasi materi

- Seluruh isi diambil dari rangkuman training. Label **contoh susunan belajar** dipertahankan pada daftar
  sembilan komponen laptop dan delapan tahap pelayanan.
- Ilustrasi 3D bersifat generik, bukan foto atau model produk asli.
- Simulasi Vivobook Go 14 mempertahankan langkah **mengecek varian** dan tidak menambahkan spesifikasi, harga,
  stok, atau garansi yang belum diketahui.
