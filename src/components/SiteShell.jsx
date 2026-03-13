import { Link, NavLink } from 'react-router-dom'
import { FiArrowUpRight, FiCalendar, FiGrid, FiHome } from 'react-icons/fi'

const links = [
  { to: '/', label: 'Início', icon: FiHome },
  { to: '/agendar', label: 'Agendar', icon: FiCalendar },
  { to: '/painel', label: 'Painel', icon: FiGrid },
]

export default function SiteShell({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(7,7,7,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line-strong)] bg-[linear-gradient(135deg,var(--accent),#8b6500)] text-[var(--bg)] shadow-[0_0_24px_rgba(245,197,24,0.16)]">
              <span className="text-lg font-black">BL</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--muted)]">barber booking</p>
              <p className="text-lg font-black uppercase tracking-[0.08em] text-[var(--text)]">Emerson Barber Shop</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(18,18,18,0.88)] p-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[var(--accent)] text-[var(--bg)]'
                      : 'text-[var(--muted)] hover:bg-[rgba(245,197,24,0.08)] hover:text-[var(--text)]'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/agendar"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Reservar horário
            <FiArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">{children}</main>

      <footer className="border-t border-[var(--line)] bg-[rgba(10,10,10,0.95)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Emerson Barber Shop</p>
            <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
              Agenda online, catálogo de serviços e visão administrativa em um único front com dados mockados.
            </p>
          </div>
          <div className="text-sm text-[var(--muted)]">
            <p>Atendimento de terça a sábado, das 9h às 20h.</p>
            <p>Rua da Saboaria, 103 • Boa Vista de Sao Caetano, Salvador - BA</p>
          </div>
        </div>
      </footer>
    </div>
  )
}