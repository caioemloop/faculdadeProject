import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiClock, FiPhone, FiUser } from 'react-icons/fi'
import { api } from '../api.js'
import { formatCurrency, formatLongDate, todayKey } from '../lib/format.js'

const steps = ['Serviço', 'Barbeiro', 'Horário', 'Confirmar']

function getTomorrow() {
  const [year, month, day] = todayKey().split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

export default function BookingPage({ services, barbers, onCreateAppointment }) {
  const [step, setStep] = useState(0)
  const [confirmation, setConfirmation] = useState(null)
  const [slotOptions, setSlotOptions] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    serviceId: services[0]?.id ?? '',
    barberId: '',
    date: getTomorrow(),
    time: '',
    clientName: '',
    phone: '',
  })

  const selectedService = services.find((service) => service.id === form.serviceId)
  const selectedBarber = barbers.find((barber) => barber.id === form.barberId)
  const occupiedCount = slotOptions.filter((slot) => !slot.available).length

  useEffect(() => {
    if (!form.barberId || !form.date) {
      setSlotOptions([])
      return
    }

    let ignore = false
    setSlotsLoading(true)
    setSlotsError('')

    api(`/api/slots?barberId=${encodeURIComponent(form.barberId)}&date=${encodeURIComponent(form.date)}`)
      .then((data) => {
        if (ignore) return
        setSlotOptions(data.slots)
        setForm((current) => {
          const stillOpen = data.slots.some((slot) => slot.time === current.time && slot.available)
          if (!current.time || stillOpen) return current
          return { ...current, time: '' }
        })
      })
      .catch((error) => {
        if (!ignore) {
          setSlotOptions([])
          setSlotsError(error.message)
        }
      })
      .finally(() => {
        if (!ignore) setSlotsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [form.barberId, form.date])

  const canAdvance =
    (step === 0 && Boolean(form.serviceId)) ||
    (step === 1 && Boolean(form.barberId)) ||
    (step === 2 && Boolean(form.date && form.time))

  const handleConfirm = async () => {
    if (!form.clientName.trim() || !form.phone.trim() || submitting) {
      return
    }

    setSubmitError('')
    setSubmitting(true)

    try {
      const created = await onCreateAppointment({
        clientName: form.clientName.trim(),
        phone: form.phone.trim(),
        barberId: form.barberId,
        serviceId: form.serviceId,
        date: form.date,
        time: form.time,
      })
      setConfirmation(created)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmation) {
    const confirmedService = services.find((service) => service.id === confirmation.serviceId)
    const confirmedBarber = barbers.find((barber) => barber.id === confirmation.barberId)

    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(245,197,24,0.08),rgba(13,13,13,0.98)_30%)] p-6 md:p-8">
        <div className="flex justify-center text-[var(--accent)]">
          <FiCheckCircle size={72} />
        </div>
        <div className="mt-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--accent)]">reserva criada</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-[var(--text)]">Agendamento confirmado</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
            A reserva foi gravada no banco e o horário fica bloqueado para o mesmo barbeiro.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <SummaryCard label="Cliente" value={confirmation.clientName} />
          <SummaryCard label="Contato" value={confirmation.phone} />
          <SummaryCard label="Serviço" value={confirmedService?.name} />
          <SummaryCard label="Barbeiro" value={confirmedBarber?.name} />
          <SummaryCard label="Data" value={formatLongDate(confirmation.date)} />
          <SummaryCard label="Horário" value={confirmation.time} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/painel"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--bg)] transition hover:-translate-y-0.5"
          >
            Ver no painel
          </Link>
          <Link
            to="/"
            className="rounded-full border border-[var(--line-strong)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Voltar para início
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(245,197,24,0.07),rgba(13,13,13,0.98)_24%)] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--accent)]">agendamento online</p>
            <h1 className="mt-3 text-4xl font-black uppercase text-[var(--text)]">Monte o horário em quatro etapas</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Escolha o serviço, encaixe o barbeiro certo e reserve um horário livre sem duplicidade.
            </p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--accent)]">
            <FiArrowLeft size={15} />
            voltar para início
          </Link>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {steps.map((label, index) => {
            const active = index === step
            const completed = index < step

            return (
              <div
                key={label}
                className={`rounded-[1.3rem] border p-4 transition ${
                  active
                    ? 'border-[var(--accent)] bg-[rgba(245,197,24,0.08)]'
                    : completed
                      ? 'border-[var(--line-strong)] bg-[rgba(245,197,24,0.05)]'
                      : 'border-[var(--line)] bg-[rgba(255,255,255,0.02)]'
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${active || completed ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
                  etapa 0{index + 1}
                </p>
                <p className="mt-2 text-lg font-black uppercase text-[var(--text)]">{label}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => {
                const isSelected = form.serviceId === service.id

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, serviceId: service.id }))}
                    className={`rounded-[1.5rem] border p-5 text-left transition ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[rgba(245,197,24,0.08)]'
                        : 'border-[var(--line)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--line-strong)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full border border-[var(--line-strong)] bg-[rgba(245,197,24,0.08)] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
                        {service.badge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--muted)]">
                        <FiClock size={14} />
                        {service.duration} min
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black uppercase text-[var(--text)]">{service.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{service.description}</p>
                    <p className="mt-5 text-lg font-black text-[var(--accent)]">{formatCurrency(service.price)}</p>
                  </button>
                )
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-3">
              {barbers.map((barber) => {
                const isSelected = form.barberId === barber.id

                return (
                  <button
                    key={barber.id}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, barberId: barber.id, time: '' }))}
                    className={`rounded-[1.5rem] border p-5 text-left transition ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[rgba(245,197,24,0.08)]'
                        : 'border-[var(--line)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--line-strong)]'
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-black text-[var(--bg)]">
                      {barber.initials}
                    </div>
                    <h2 className="mt-4 text-xl font-black uppercase text-[var(--text)]">{barber.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{barber.specialty}</p>
                    <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                      <p>{barber.experience}</p>
                      <p>Escala {barber.shift}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-[0.4fr_0.6fr]">
                <label className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Escolha a data</span>
                  <input
                    type="date"
                    value={form.date}
                    min={todayKey()}
                    onChange={(event) => setForm((current) => ({ ...current, date: event.target.value, time: '' }))}
                    className="mt-4 w-full rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </label>

                <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Leitura rápida</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <InfoCard label="Barbeiro" value={selectedBarber?.name ?? 'Selecione um profissional'} />
                    <InfoCard label="Horários indisponíveis" value={form.barberId ? String(occupiedCount) : '0'} />
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Horários disponíveis</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {slotOptions.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available || !form.barberId}
                      onClick={() => setForm((current) => ({ ...current, time: slot.time }))}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        form.time === slot.time
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                          : !slot.available
                            ? 'cursor-not-allowed border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[rgba(247,242,208,0.28)]'
                            : 'border-[var(--line)] bg-[var(--soft)] text-[var(--text)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                {slotsLoading && <p className="mt-4 text-sm text-[var(--muted)]">Consultando horários livres...</p>}
                {slotsError && <p className="mt-4 text-sm text-rose-300">{slotsError}</p>}
                {!form.barberId && (
                  <p className="mt-4 text-sm text-[var(--muted)]">Selecione primeiro um barbeiro para liberar os horários.</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Resumo da reserva</p>
                <div className="mt-5 space-y-4">
                  <InfoCard label="Serviço" value={selectedService?.name} />
                  <InfoCard label="Valor" value={selectedService ? formatCurrency(selectedService.price) : ''} />
                  <InfoCard label="Duração" value={selectedService ? `${selectedService.duration} min` : ''} />
                  <InfoCard label="Barbeiro" value={selectedBarber?.name} />
                  <InfoCard label="Data" value={form.date ? formatLongDate(form.date) : ''} />
                  <InfoCard label="Horário" value={form.time} />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Dados do cliente</p>
                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                      <FiUser size={14} />
                      Nome completo
                    </span>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))}
                      placeholder="Digite o nome do cliente"
                      className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                      <FiPhone size={14} />
                      Telefone
                    </span>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                      placeholder="(00) 00000-0000"
                      className="w-full rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            disabled={step === 0}
            className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--muted)] transition hover:border-[var(--line-strong)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Voltar
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(current + 1, steps.length - 1))}
              disabled={!canAdvance}
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--bg)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima etapa
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!form.clientName.trim() || !form.phone.trim() || submitting}
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--bg)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Salvando...' : 'Confirmar reserva'}
            </button>
          )}
        </div>
        {submitError && <p className="mt-4 text-sm text-rose-300">{submitError}</p>}
      </section>

      <aside className="space-y-5">
        <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Resumo ao lado</p>
          <h2 className="mt-3 text-2xl font-black uppercase text-[var(--text)]">Seu encaixe</h2>
          <div className="mt-5 space-y-3">
            <InfoCard label="Serviço" value={selectedService?.name ?? 'Selecione'} />
            <InfoCard label="Barbeiro" value={selectedBarber?.name ?? 'Selecione'} />
            <InfoCard label="Data" value={form.date ? formatLongDate(form.date) : 'Escolha'} />
            <InfoCard label="Hora" value={form.time || 'Escolha'} />
          </div>
          <div className="mt-6 rounded-[1.4rem] border border-[var(--line-strong)] bg-[rgba(245,197,24,0.08)] p-4">
            <p className="text-sm font-semibold text-[var(--bg)]">Total previsto</p>
            <p className="mt-2 text-3xl font-black text-[var(--bg)]">{selectedService ? formatCurrency(selectedService.price) : '--'}</p>
          </div>
        </div>

      </aside>
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--text)]">{value || '—'}</p>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5 text-left">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{label}</p>
      <p className="mt-3 text-lg font-semibold text-[var(--text)]">{value || '—'}</p>
    </div>
  )
}