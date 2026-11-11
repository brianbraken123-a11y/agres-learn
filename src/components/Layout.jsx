import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SUMBER } from '../content/index.js'

export default function Layout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])

  return (
    <div className="aplikasi">
      <a className="lewati" href="#konten">
        Lewati ke konten
      </a>
      <header className="kepala">
        <div className="kepala-dalam">
          <Link to="/" className="merek" aria-label="Belajar AGRES.ID, kembali ke halaman utama">
            <span className="merek-tanda" aria-hidden="true">
              A
            </span>
            <span className="merek-teks">
              <strong>Belajar AGRES.ID</strong>
              <small>{SUMBER.periode}</small>
            </span>
          </Link>
          <nav className="nav-utama" aria-label="Navigasi utama">
            <Link to="/" className={pathname === '/' ? 'aktif' : ''}>
              Hari
            </Link>
            <Link to="/review" className={pathname === '/review' ? 'aktif' : ''}>
              Hafalan
            </Link>
          </nav>
        </div>
      </header>
      <main id="konten" className="isi">
        {children}
      </main>
      <footer className="kaki">
        <p>
          Disusun dari <strong>{SUMBER.nama}</strong> ({SUMBER.periode}). Progres belajar tersimpan di browser
          ini saja, tanpa login.
        </p>
        <p className="kaki-kecil">{SUMBER.catatan}</p>
      </footer>
    </div>
  )
}
