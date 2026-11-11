import { useCallback, useEffect, useMemo, useState } from 'react'

const KEY = 'agres-learn-progress-v1'

const emptyDay = () => ({
  pelajari: false,
  praktik: false,
  kuis: null,
  review: false,
  update: {},
})

const initial = () => ({
  v: 1,
  days: { 1: emptyDay(), 2: emptyDay(), 3: emptyDay() },
  terakhir: null,
  simulasi: {},
  bicara: {},
  tampilan: null,
})

function safeParse(raw) {
  if (!raw) return initial()
  try {
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return initial()
    const base = initial()
    const merged = { ...base, ...data }
    merged.days = { ...base.days, ...(data.days || {}) }
    for (const id of [1, 2, 3]) {
      merged.days[id] = { ...emptyDay(), ...(merged.days?.[id] || {}) }
    }
    return merged
  } catch {
    return initial()
  }
}

export function hitungPersen(hari) {
  if (!hari) return 0
  const bagian = [hari.pelajari, hari.praktik, Boolean(hari.kuis), hari.review]
  const selesai = bagian.filter(Boolean).length
  return Math.round((selesai / bagian.length) * 100)
}

export function useProgress() {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initial()
    return safeParse(window.localStorage.getItem(KEY))
  })

  // Simpan setiap kali state berubah.
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* localStorage penuh atau diblokir: progres tetap jalan di memori */
    }
  }, [state])

  const tandai = useCallback((dayId, section, value = true) => {
    setState((s) => {
      const hari = { ...(s.days?.[dayId] || emptyDay()) }
      hari[section] = value
      hari.update = { ...(hari.update || {}), [section]: Date.now() }
      return { ...s, days: { ...s.days, [dayId]: hari } }
    })
  }, [])

  const catatKuis = useCallback((dayId, hasil) => {
    setState((s) => {
      const hari = { ...(s.days?.[dayId] || emptyDay()) }
      const lama = hari.kuis
      const lebihBaik = !lama || hasil.skor > lama.skor || (hasil.skor === lama.skor && hasil.total > lama.total)
      hari.kuis = lebihBaik ? hasil : { ...hasil, skor: lama.skor, total: lama.total, terbaik: true }
      hari.update = { ...(hari.update || {}), kuis: Date.now() }
      return { ...s, days: { ...s.days, [dayId]: hari } }
    })
  }, [])

  const catatSimulasi = useCallback((dayId, hasil) => {
    setState((s) => {
      const lama = s.simulasi?.[dayId]
      const terbaik = !lama || hasil.tepat > lama.tepat
      return {
        ...s,
        simulasi: { ...s.simulasi, [dayId]: terbaik ? hasil : { ...lama, percobaanTerakhir: hasil } },
      }
    })
  }, [])

  const catatBicara = useCallback((dayId, hasil) => {
    setState((s) => ({
      ...s,
      bicara: { ...s.bicara, [dayId]: { ...(s.bicara?.[dayId] || {}), ...hasil } },
    }))
  }, [])

  const setTerakhir = useCallback((path, section) => {
    setState((s) => ({ ...s, terakhir: { path, section, waktu: Date.now() } }))
  }, [])

  const setTampilan = useCallback((mode) => {
    setState((s) => ({ ...s, tampilan: mode }))
  }, [])

  const resetHari = useCallback((dayId) => {
    setState((s) => ({ ...s, days: { ...s.days, [dayId]: emptyDay() } }))
  }, [])

  const resetSemua = useCallback(() => {
    setState(initial())
  }, [])

  const totalPersen = useMemo(() => {
    const nilai = [1, 2, 3].map((id) => hitungPersen(state.days?.[id]))
    return Math.round(nilai.reduce((a, b) => a + b, 0) / nilai.length)
  }, [state.days])

  const beresSemua = useMemo(
    () => [1, 2, 3].every((id) => hitungPersen(state.days?.[id]) === 100),
    [state.days]
  )

  return {
    progress: state,
    tandai,
    catatKuis,
    catatSimulasi,
    catatBicara,
    setTerakhir,
    setTampilan,
    resetHari,
    resetSemua,
    totalPersen,
    beresSemua,
  }
}
