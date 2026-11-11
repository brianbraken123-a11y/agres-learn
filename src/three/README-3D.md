# Scene 3D — kontrak komponen

Dua komponen three.js langsung (tanpa `@react-three/fiber`), di-load lewat `React.lazy` dari
`src/components/ScenePanel.jsx` supaya bundle awal tetap ringan.

## LaptopScene

```jsx
const LaptopScene = lazy(() => import('../three/LaptopScene.jsx'))

<LaptopScene activeId={idAtauNull} onSelect={(id) => setAktif(id)} className="kanvas-3d" />
```

- `activeId`: salah satu dari `cpu`, `gpu`, `ram`, `penyimpanan`, `layar`, `baterai`,
  `motherboard`, `pendingin`, `port` (atau `null`).
- `onSelect(id)`: dipanggil dari klik/tap/Enter pada penanda hotspot.
- OrbitControls aktif (damping), polar angle dibatasi supaya kamera tidak menembus lantai.

## PhoneScene

```jsx
<PhoneScene activeId={id} onSelect={setAktif} exploded={buka} className="kanvas-3d" />
```

- `activeId`: `chipset`, `ram`, `penyimpanan`, `layar`, `kamera`, `baterai`, `konektivitas`.
- `exploded`: memisahkan lapisan (layar, papan+chip, kamera, baterai, rangka) secara vertikal,
  dianimasikan lerp; grup dikecilkan dan digeser supaya semua lapisan tetap masuk frame.

## Aturan yang dipatuhi kedua scene

- Hotspot dirender sebagai `<button type="button">` DOM di atas canvas, posisinya diproyeksikan
  tiap frame, jadi bisa di-tap, diklik, dan di-TAB. Label teks disembunyikan di lebar < 520px
  (mode ringkas: pin bernomor).
- `prefers-reduced-motion`: auto-rotate mati dan transisi snap (tanpa lerp).
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, `ResizeObserver` untuk ukuran.
- Cleanup lengkap saat unmount: `cancelAnimationFrame`, disconnect observer, lepas listener,
  `controls.dispose()`, `renderer.dispose()` + `forceContextLoss()`, lalu dispose geometry/material.
- Tidak ada akses `window`/`document` di top-level (aman untuk lazy import dan SSR).
- Kalau WebGL tidak tersedia: render pesan singkat, bukan crash. `ScenePanel` juga punya
  `Batas3D` (error boundary) dan tombol **2D** sebagai cadangan dengan materi yang sama.
