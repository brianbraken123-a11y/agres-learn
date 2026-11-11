import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { ProgressProvider } from './ProgressContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import DayPage from './pages/DayPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'

export default function App() {
  return (
    <ProgressProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hari/:id" element={<DayPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/hari" element={<Navigate to="/" replace />} />
          <Route
            path="*"
            element={
              <section className="kosong">
                <h1>Halaman tidak ditemukan</h1>
                <p>Alamatnya belum ada di website ini.</p>
                <Link className="tombol tombol-utama" to="/">
                  Balik ke halaman utama
                </Link>
              </section>
            }
          />
        </Routes>
      </Layout>
    </ProgressProvider>
  )
}
