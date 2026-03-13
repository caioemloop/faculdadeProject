import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiShield,
  FiStar,
} from 'react-icons/fi'
import { formatCurrency, highlights, testimonials } from '../data/mockData.js'

const valueProps = [
  {
    title: 'Agenda sem ruído',
    description: 'Escolha serviço, barbeiro e horário com visual claro e sem depender de mensagem manual.',
    icon: FiCalendar,
  },
  {
    title: 'Ritmo de atendimento',
    description: 'A rotina fica organizada por blocos, reduzindo atraso, encaixe mal feito e horário duplicado.',
    icon: FiClock,
  },
  {
    title: 'Imagem profissional',
    description: 'A experiência passa mais confiança para o cliente e mostra um negócio preparado para crescer.',
    icon: FiShield,
  },
]

export default function HomePage({ services, barbers, appointments }) {
  const activeAppointments = appointments.filter((item) => item.status !== 'cancelado')
  const topServices = services.slice(0, 4)

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="gold-grid relative overflow-hidden rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(135deg,rgba(245,197,24,0.16),rgba(245,197,24,0.03)_28%,rgba(0,0,0,0.96)_68%)] px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:px-10 md:py-12">
        <div className="absolute right-[-2rem] top-[-2rem] h-40 w-40 rounded-full bg-[rgba(245,197,24,0.18)] blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[10%] h-40 w-40 rounded-full bg-[rgba(245,197,24,0.12)] blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[rgba(245,197,24,0.08)] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Preto, amarelo e corte na régua
            </div>

            <div className="space-y-4">
              <p className="max-w-xl text-sm uppercase tracking-[0.3em] text-[var(--muted)]">agendamento online para barbearia</p>
              <h1 className="max-w-3xl text-4xl font-black uppercase leading-none text-[var(--text)] md:text-6xl">
                Agenda enxuta para quem quer lotar a cadeira sem perder o controle.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                Um front pensado para barbearia: escolha rápida de serviço, barbeiro e horário, com visual forte e painel de acompanhamento em tempo real com dados mockados.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/agendar"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--bg)] transition hover:translate-x-1"
              >
                Marcar agora
                <FiArrowRight size={16} />
              </Link>
              <Link
                to="/painel"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[rgba(15,15,15,0.8)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Ver painel demo
              </Link>
            </div>
          </div>

          <div className="panel-edge grain rounded-[1.75rem] border border-[var(--line)] bg-[rgba(11,11,11,0.92)] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">turno de hoje</p>
                <h2 className="mt-2 text-2xl font-black uppercase text-[var(--text)]">Operação de bancada</h2>
              </div>
              <span className="rounded-full border border-[var(--line-strong)] bg-[rgba(245,197,24,0.08)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
                ao vivo
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--line)] bg-[rgba(245,245,245,0.02)] p-4">
                  <p className="text-3xl font-black text-[var(--accent)]">{item.value}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[rgba(245,197,24,0.05)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Próximo encaixe livre</p>
              <p className="mt-2 text-2xl font-black text-[var(--accent)]">Hoje às 16:30</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{activeAppointments.length} reservas ativas espalhadas nos próximos dias.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {valueProps.map(({ title, description, icon: Icon }) => (
          <article key={title} className="panel-edge rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel)] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line-strong)] bg-[rgba(245,197,24,0.09)] text-[var(--accent)]">
              <Icon size={20} />
            </div>
            <h2 className="mt-5 text-xl font-black uppercase text-[var(--text)]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">catálogo</p>
              <h2 className="mt-2 text-3xl font-black uppercase text-[var(--text)]">Serviços com ticket e duração definidos</h2>
            </div>
            <Link to="/agendar" className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
              abrir agendamento
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {topServices.map((service) => (
              <article key={service.id} className="panel-edge rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-[var(--line-strong)] bg-[rgba(245,197,24,0.08)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {service.badge}
                  </span>
                  <span className="text-sm text-[var(--muted)]">{service.duration} min</span>
                </div>
                <h3 className="mt-5 text-xl font-black uppercase text-[var(--text)]">{service.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{service.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <span className="text-lg font-black text-[var(--accent)]">{formatCurrency(service.price)}</span>
                  <Link to="/agendar" className="text-sm font-semibold text-[var(--text)] transition hover:text-[var(--accent)]">
                    reservar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(245,197,24,0.08),rgba(18,18,18,0.98)_25%)] p-6">
          <div className="flex items-center gap-3 text-[var(--accent)]">
            <FiMapPin size={16} />
            <p className="text-xs font-bold uppercase tracking-[0.22em]">equipe da casa</p>
          </div>
          <h2 className="mt-4 text-3xl font-black uppercase text-[var(--text)]">Barbeiros com estilo de atendimento diferente.</h2>
          <div className="mt-6 space-y-4">
            {barbers.map((barber) => (
              <article key={barber.id} className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-black text-[var(--bg)]">
                    {barber.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-[var(--text)]">{barber.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{barber.specialty}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full border border-[var(--line)] px-3 py-1">{barber.experience}</span>
                  <span className="rounded-full border border-[var(--line)] px-3 py-1">Escala {barber.shift}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">prova social</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--text)]">Experiência pensada para cliente e operação.</h2>
          <div className="mt-6 space-y-4">
            {testimonials.map((item) => (
              <blockquote key={item.id} className="rounded-[1.4rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                <div className="flex items-center gap-1 text-[var(--accent)]">
                  <FiStar size={15} />
                  <FiStar size={15} />
                  <FiStar size={15} />
                  <FiStar size={15} />
                  <FiStar size={15} />
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--text)]">“{item.quote}”</p>
                <footer className="mt-4 text-sm font-semibold text-[var(--muted)]">{item.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>

        <div className="panel-edge rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(245,197,24,0.07),rgba(17,17,17,0.98)_42%)] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">como funciona</p>
          <h2 className="mt-3 text-3xl font-black uppercase text-[var(--text)]">Fluxo simples para evitar agenda no improviso.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              'Cliente escolhe o serviço com duração e valor já visíveis.',
              'Seleciona o barbeiro e vê apenas horários realmente livres.',
              'Painel acompanha status, ticket e ocupação com dados mockados.',
            ].map((step, index) => (
              <div key={step} className="rounded-[1.4rem] border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-5">
                <p className="text-4xl font-black text-[var(--accent)]">0{index + 1}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--line-strong)] bg-[rgba(245,197,24,0.08)] px-5 py-4">
            <div>
              <p className="text-sm font-black uppercase text-[var(--bg)]">Pronto para testar a jornada?</p>
              <p className="mt-1 text-sm text-[rgba(0,0,0,0.72)]">Use o fluxo de agendamento e depois confira o impacto no painel.</p>
            </div>
            <Link
              to="/agendar"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--bg)] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[var(--accent)] transition hover:-translate-y-0.5"
            >
              testar fluxo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}