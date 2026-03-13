import { useState } from 'react'
import { FiCalendar, FiCheckCircle, FiClock, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { formatCurrency, formatLongDate, statusLabels } from '../data/mockData.js'

const statusStyles = {
  confirmado: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-300',
  pendente: 'border-amber-500/30 bg-amber-500/12 text-amber-200',
  concluido: 'border-sky-500/30 bg-sky-500/12 text-sky-200',
  cancelado: 'border-rose-500/30 bg-rose-500/12 text-rose-200',
}

export default function AdminPage({ services, barbers, appointments }) {
  const [filter, setFilter] = useState('todos')

  const filteredAppointments =
    filter === 'todos'
      ? appointments
      : appointments.filter((appointment) => appointment.status === filter)

  const orderedAppointments = [...filteredAppointments].sort((left, right) => {
    const leftDate = `${left.date} ${left.time}`
    const rightDate = `${right.date} ${right.time}`
    return leftDate.localeCompare(rightDate)
  })

  const activeAppointments = appointments.filter((appointment) => appointment.status !== 'cancelado')
  const projectedRevenue = activeAppointments.reduce((total, appointment) => {
    const service = services.find((item) => item.id === appointment.serviceId)
    return total + (service?.price ?? 0)
  }, 0)

  const todayKey = '2026-03-13'
  const todayQueue = appointments.filter((appointment) => appointment.date === todayKey && appointment.status !== 'cancelado')
  const confirmedCount = appointments.filter((appointment) => appointment.status === 'confirmado').length
  const pendingCount = appointments.filter((appointment) => appointment.status === 'pendente').length

  const serviceDemand = services.map((service) => ({
    ...service,
    total: appointments.filter((appointment) => appointment.serviceId === service.id && appointment.status !== 'cancelado').length,
  }))

  const maxDemand = Math.max(...serviceDemand.map((item) => item.total), 1)

  const barberLoad = barbers.map((barber) => ({
    ...barber,
    total: appointments.filter((appointment) => appointment.barberId === barber.id && appointment.status !== 'cancelado').length,
  }))

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(135deg,rgba(245,197,24,0.13),rgba(18,18,18,0.95)_28%,rgba(9,9,9,1)_70%)] p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--accent)]">painel administrativo</p>
            <h1 className="mt-3 text-4xl font-black uppercase text-[var(--text)]">Leitura rápida da operação</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Visão de agendamentos, ocupação e ticket potencial com os mesmos dados mockados usados no fluxo do cliente.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-5 py-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--text)]">Base simulada atual</p>
            <p className="mt-2">{formatLongDate(todayKey)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Agenda ativa" value={String(activeAppointments.length)} icon={FiCalendar} />
          <MetricCard label="Confirmados" value={String(confirmedCount)} icon={FiCheckCircle} />
          <MetricCard label="Pendentes" value={String(pendingCount)} icon={FiClock} />
          <MetricCard label="Receita projetada" value={formatCurrency(projectedRevenue)} icon={FiDollarSign} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {['todos', 'confirmado', 'pendente', 'concluido', 'cancelado'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                  filter === status
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                    : 'border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--text)]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">agenda filtrada</p>
                <h2 className="mt-2 text-2xl font-black uppercase text-[var(--text)]">Reservas cadastradas</h2>
              </div>
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {orderedAppointments.length} itens
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {orderedAppointments.length === 0 && (
                <div className="rounded-[1.4rem] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.02)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                  Nenhum agendamento para o filtro selecionado.
                </div>
              )}

              {orderedAppointments.map((appointment) => {
                const service = services.find((item) => item.id === appointment.serviceId)
                const barber = barbers.find((item) => item.id === appointment.barberId)

                return (
                  <article key={appointment.id} className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-black uppercase text-[var(--text)]">{appointment.clientName}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{service?.name} com {barber?.name}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${statusStyles[appointment.status]}`}>
                        {statusLabels[appointment.status]}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <PanelInfo label="Data" value={formatLongDate(appointment.date)} />
                      <PanelInfo label="Hora" value={appointment.time} />
                      <PanelInfo label="Ticket" value={service ? formatCurrency(service.price) : '—'} />
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] p-5 md:p-6">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <FiTrendingUp size={16} />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">fila do dia</p>
            </div>
            <h2 className="mt-3 text-2xl font-black uppercase text-[var(--text)]">Hoje na agenda</h2>
            <div className="mt-5 space-y-3">
              {todayQueue.map((appointment) => {
                const service = services.find((item) => item.id === appointment.serviceId)
                const barber = barbers.find((item) => item.id === appointment.barberId)

                return (
                  <div key={appointment.id} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--soft)] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[var(--text)]">{appointment.time} • {appointment.clientName}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{service?.name} com {barber?.name}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase ${statusStyles[appointment.status]}`}>
                        {statusLabels[appointment.status]}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] p-5 md:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">demanda por serviço</p>
            <div className="mt-5 space-y-4">
              {serviceDemand.map((service) => (
                <div key={service.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[var(--text)]">{service.name}</span>
                    <span className="text-[var(--muted)]">{service.total} reservas</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[rgba(255,255,255,0.06)]">
                    <div
                      className="h-2 rounded-full bg-[var(--accent)]"
                      style={{ width: `${(service.total / maxDemand) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] p-5 md:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">carga por barbeiro</p>
            <div className="mt-5 space-y-3">
              {barberLoad.map((barber) => (
                <div key={barber.id} className="rounded-[1.3rem] border border-[var(--line)] bg-[var(--soft)] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[var(--text)]">{barber.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{barber.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[var(--accent)]">{barber.total}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">reservas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">{label}</p>
          <p className="mt-3 text-3xl font-black text-[var(--text)]">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line-strong)] bg-[rgba(245,197,24,0.09)] text-[var(--accent)]">
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

function PanelInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--text)]">{value}</p>
    </div>
  )
}