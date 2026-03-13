
import { Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import SiteShell from './components/SiteShell.jsx'
import { appointments as seedAppointments, barbers, services } from './data/mockData.js'
import HomePage from './pages/HomePage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
  const [appointments, setAppointments] = useState(seedAppointments)

  const handleCreateAppointment = (appointment) => {
    setAppointments((current) => [appointment, ...current])
  }

  return (
    <SiteShell>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              services={services}
              barbers={barbers}
              appointments={appointments}
            />
          }
        />
        <Route
          path="/agendar"
          element={
            <BookingPage
              services={services}
              barbers={barbers}
              appointments={appointments}
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
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  )
}