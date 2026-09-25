import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SiteShell from './components/SiteShell.jsx'
import { api, loadAgenda } from './api.js'
import HomePage from './pages/HomePage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
  const [shop, setShop] = useState(null)
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [nextSlot, setNextSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    loadAgenda()
      .then((data) => {
        if (ignore) return
        setShop(data.shop)
        setServices(data.services)
        setBarbers(data.barbers)
        setAppointments(data.appointments)
        setNextSlot(data.nextSlot)
      })
      .catch((loadError) => {
        if (!ignore) setError(loadError.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const refreshNextSlot = async () => {
    const nextSlotData = await api('/api/next-slot')
    setNextSlot(nextSlotData.slot)
  }

  const handleCreateAppointment = async (payload) => {
    const created = await api('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setAppointments((current) => [...current, created])
    await refreshNextSlot()
    return created
  }

  const handleUpdateStatus = async (id, status) => {
    const updated = await api(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    await refreshNextSlot()
    return updated
  }

  return (
    <SiteShell shop={shop}>
      {loading && <p className="text-sm text-[var(--muted)]">Carregando a agenda...</p>}
      {!loading && error && (
        <section className="mx-auto max-w-xl rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel)] p-6 text-center">
          <p className="text-lg font-black uppercase text-[var(--text)]">Não foi possível carregar a agenda</p>
          <p className="mt-3 text-sm text-[var(--muted)]">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              setError('')
              loadAgenda()
                .then((data) => {
                  setShop(data.shop)
                  setServices(data.services)
                  setBarbers(data.barbers)
                  setAppointments(data.appointments)
                  setNextSlot(data.nextSlot)
                })
                .catch((loadError) => setError(loadError.message))
                .finally(() => setLoading(false))
            }}
            className="mt-5 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-black uppercase text-[var(--bg)]"
          >
            Tentar de novo
          </button>
        </section>
      )}
      {!loading && !error && (
        <Routes>
          <Route
            path="/"
            element={<HomePage services={services} barbers={barbers} appointments={appointments} nextSlot={nextSlot} />}
          />
          <Route
            path="/agendar"
            element={
              <BookingPage
                services={services}
                barbers={barbers}
                onCreateAppointment={handleCreateAppointment}
              />
            }
          />
          <Route
            path="/painel"
            element={
              <AdminPage
                services={services}
                barbers={barbers}
                appointments={appointments}
                onUpdateStatus={handleUpdateStatus}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </SiteShell>
  )
}
