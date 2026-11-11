# DESIGN.md — AGRES.ID Learn

Spesifikasi desain website belajar interaktif (Vite + React). Semua nilai visual
berasal dari `src/styles/tokens.css`; dokumen ini mengatur **cara memakainya**.

## 1. Prinsip visual

1. **Gelap karena 3D-nya gelap.** Kanvas navy (`--color-bg`) menyatu dengan scene
   three.js; panel bertingkat (`--color-surface` → `-2` → `-3`), bukan putih.
2. **Satu aksen per konteks.** Cyan (`--color-accent`) untuk aksi utama & progres,
   violet hanya sekunder. Tiap hari punya warna identitas (`--color-day-1/2/3`).
3. **Konten dulu.** Glow/shadow hanya menandai elemen interaktif atau state aktif;
   tidak ada animasi yang menunda pemahaman. Aksi utama di jangkauan ibu jari.
4. **Tenang dan jujur.** Warna status hanya untuk feedback; bahasa Indonesia,
   sapaan "kamu", tanpa jargon di teks UI.

## 2. Layout responsif

Breakpoint: **HP 360–430px**, **tablet 431–1023px** (seperti HP, grid 2 kolom),
**desktop ≥1024px**.

| Area | HP (360–430) | Desktop (≥1024) |
|---|---|---|
| Gutter / container | `--page-gutter` 16–24px | gutter ≤40px, `--container-max` 1180px |
| Header | 56–64px: judul + ring kecil | `--header-h` 64px: judul + nav |
| Beranda 3 hari | 1 kolom kartu, scroll | grid 3 kolom, hover lift |
| Halaman modul | scene 3D atas ~45dvh, detail bottom sheet | scene kiri 65% + side panel 360px |
| Navigasi alur | tab sticky di bawah header | tab di atas konten |
| Aksi bawah | full-width ≥44px, hormati `--safe-bottom` | rata kanan, lebar konten |

**Beranda:** hero 1 kalimat tujuan + chip progres total, lalu tiga `DayCard`
(nomor hari, ikon, judul, 1 baris ringkasan, jumlah komponen/tahap, ring progres,
tombol "Mulai"/"Lanjutkan"). Di HP kartu bertumpuk penuh — tanpa carousel.

**Halaman modul — alur Pelajari → Praktik → Kuis → Review:**
- Tab alur sticky, menandai tahap aktif + selesai; tahap selesai bisa dibuka ulang.
- **Pelajari**: scene 3D + daftar komponen/tahap; memilih item membuka panel detail
  (desktop side panel, HP bottom sheet).
- **Praktik**: game mencocokkan — drag di desktop, **tap-pilih lalu tap-target**
  di HP (jangan wajibkan drag-and-drop di layar sentuh).
- **Kuis**: satu soal per layar, progres `n/total`, feedback langsung.
- **Review**: skor per topik + daftar jawaban salah yang bisa dibuka, lalu
  "Ulangi kuis" / "Lanjut hari berikutnya".
- Progres disimpan ke localStorage per hari dan per tahap.

## 3. Ukuran sentuh & jarak

- Semua target interaktif minimal **44×44px** (`--touch-target`); hotspot 3D
  bertitik visual 14px tapi area klik `--hotspot-hit` 44px.
- Jarak antar target minimal `--touch-gap` (8px); tombol aksi bawah di HP
  tinggi 48–52px, baris daftar komponen minimal 56px.

## 4. Tipografi

`--font-sans` (system UI) untuk semua teks; `--font-mono` hanya angka spesifikasi
("16GB", "RTX 4050"). Skala sudah `clamp()`, jadi tidak perlu media query font.

| Token | Pemakaian |
|---|---|
| `--text-display` | judul hero beranda (32→52px) |
| `--text-h1` / `--text-h2` | judul halaman modul / judul section |
| `--text-h3` / `--text-h4` | judul kartu komponen / label panel detail |
| `--text-body` | paragraf materi, pertanyaan kuis |
| `--text-small` | metadata, isi chip (jangan untuk body) |
| `--text-caption` | label kecil, satuan, catatan |

Judul: `--fw-bold` + `--tracking-tight`. Subjudul: `--fw-semibold`. Body:
`--fw-regular` + `--leading-normal`. Chip: `--fw-medium` + `--tracking-wide`.
Baris materi maks 68ch di desktop; body tidak pernah <15px.

## 5. Kartu hotspot 3D

- **Titik** 14px: `--hotspot` (pasif), `--hotspot-active` + ring/halo (aktif),
  `--hotspot-visited` (sudah dibuka). Label nama muncul saat hover/fokus saja.
- **Desktop**: klik titik → **side panel kanan** 360px (`--side-panel-w`) slide-in
  `--dur-base`; scene menyempit dan kamera fokus. Isi: nama, ikon, 1 kalimat
  fungsi, 3–5 poin "yang perlu kamu tahu saat jualan", chip "sudah dipelajari".
  Tutup via X, Esc, atau klik area kosong.
- **HP**: klik titik → **bottom sheet** maks `--sheet-max-h` (82dvh), drag handle,
  radius atas `--radius-xl`, `--shadow-sheet`, backdrop `--color-overlay`.
  Geser turun untuk menutup; setelah tutup fokus balik ke titik asal.
- Konten identik di kedua ukuran; hotspot bisa dijangkau Tab + Enter/Space.
  WebGL gagal → gambar statis + daftar tombol yang sama (fallback wajib).

## 6. Animasi

- Transisi UI: `--dur-fast` (120ms) atau `--dur-base` (200ms); **maks 300ms**
  (`--dur-slow`). Kamera 3D boleh `--dur-3d` (600ms) karena bukan UI.
- Easing default `--ease-out`; `--ease-spring` hanya untuk masuknya sheet/kartu.
- Diizinkan: fade+slide 8–12px, scale 0.98→1, ring progres, stagger
  (`--delay-stagger`), pulse halus hotspot aktif.
- **Wajib** menghormati `prefers-reduced-motion` (token durasi jadi 0ms di
  tokens.css); jangan hardcode durasi. Tanpa animasi loop di halaman kuis.

## 7. Checklist aksesibilitas

- [ ] Fokus terlihat: outline 2px `--color-focus-ring` + offset 2px; jangan
      `outline: none` tanpa pengganti.
- [ ] Kontras teks ≥4.5:1 (≥3:1 untuk ≥24px); `--color-text` dan
      `--color-text-secondary` lolos di kedua tema; `--color-text-muted` ≠ body.
- [ ] Feedback benar/salah lewat `aria-live` (salah: `assertive`), bukan warna
      saja — sertakan ikon + teks, dan status selalu punya ikon/label.
- [ ] Keyboard: seluruh alur selesai tanpa mouse; urutan Tab logis; Esc menutup
      sheet/panel; fokus terperangkap di sheet saat terbuka.
- [ ] Semantik: `<button>` untuk aksi, `<a>` untuk navigasi, heading berurutan,
      `aria-current` di tab alur, `aria-pressed` di opsi game.
- [ ] Hotspot 3D punya `aria-label` + urutan Tab; ikon dekoratif `aria-hidden`,
      ikon bermakna punya teks alternatif.
- [ ] Target ≥44px; teks tetap terbaca pada zoom 200%; `<html lang="id">`,
      judul halaman unik per hari.

## 8. Komponen UI yang wajib ada

1. **AppHeader** — judul, tombol kembali, ring progres total.
2. **DayCard** — kartu 3 hari (warna hari, ring progres, CTA).
3. **ProgressRing** — SVG per hari & total; `--ring-track` / `--ring-fill` / `--ring-stroke`, persen di tengah.
4. **ProgressChip** — "3/9 komponen", "Tahap 2 dari 4", varian soft per warna hari.
5. **FlowTabs** — Pelajari / Praktik / Kuis / Review; aktif, selesai (centang), `aria-current`, scroll horizontal di HP.
6. **Scene3D + Hotspot** — kanvas, orbit ringan, titik hotspot, fallback gambar.
7. **DetailPanel / BottomSheet** — detail komponen + drag handle di HP.
8. **QuestionCard** — nomor soal, pertanyaan, progres `n/total`, satu aksi utama.
9. **AnswerOption** — full-width ≥52px, state idle/terpilih/benar/salah, ikon + label, `aria-pressed`.
10. **MatchBoard** — dua kolom kartu + pasangan berwarna; salah = getar 1×, tanpa drag wajib.
11. **ChatBubble** — penjual kiri, pembeli kanan, varian sistem/waktu, maks 80% lebar.
12. **CircleTimer** — timer 90 detik latihan bicara; ring berjalan, `--color-warning` di 20 detik sisa, `--color-danger` di 5 detik, plus teks angka.
13. **ResultSummary** — skor, benar/total, topik yang perlu diulang.
14. **PrimaryButton / GhostButton / IconButton** — 3 varian; primer pill.
15. **Toast / InlineFeedback** — `aria-live`, auto-dismiss 4s.