export const services = [
  {
    id: 'classic-cut',
    name: 'Corte tradicional',
    price: 35,
    duration: 40,
    badge: 'Mais pedido',
    description: 'Laterais alinhadas, topo ajustado ao perfil do cliente e finalização limpa.',
  },
  {
    id: 'fade-cut',
    name: 'Degradê na régua',
    price: 45,
    duration: 50,
    badge: 'Precisão',
    description: 'Transição marcada com acabamento técnico e desenho sob medida.',
  },
  {
    id: 'beard-care',
    name: 'Barba completa',
    price: 28,
    duration: 30,
    badge: 'Express',
    description: 'Contorno, toalha quente e hidratação para manter o desenho firme.',
  },
  {
    id: 'combo',
    name: 'Combo corte + barba',
    price: 60,
    duration: 75,
    badge: 'Custo-benefício',
    description: 'Pacote fechado para quem quer sair pronto sem perder tempo.',
  },
  {
    id: 'eyebrow',
    name: 'Sobrancelha alinhada',
    price: 15,
    duration: 15,
    badge: 'Detalhe',
    description: 'Correção leve para manter expressão limpa e natural.',
  },
  {
    id: 'hydration',
    name: 'Hidratação capilar',
    price: 25,
    duration: 20,
    badge: 'Cuidado',
    description: 'Tratamento rápido para recuperar brilho e reduzir ressecamento.',
  },
]

export const barbers = [
  {
    id: 'igor',
    name: 'Igor Mendes',
    initials: 'IM',
    specialty: 'Fade técnico e acabamento na navalha',
    experience: '7 anos de bancada',
    shift: '09:00 às 18:00',
  },
  {
    id: 'leo',
    name: 'Léo Santana',
    initials: 'LS',
    specialty: 'Barba desenhada e visagismo masculino',
    experience: '5 anos de atendimento',
    shift: '10:00 às 19:00',
  },
  {
    id: 'caue',
    name: 'Cauê Brito',
    initials: 'CB',
    specialty: 'Corte social, infantil e combo rápido',
    experience: '4 anos em barbearia premium',
    shift: '11:00 às 20:00',
  },
]

export const appointments = [
  {
    id: 1001,
    clientName: 'Mateus Nogueira',
    barberId: 'igor',
    serviceId: 'fade-cut',
    date: '2026-03-13',
    time: '09:30',
    status: 'confirmado',
  },
  {
    id: 1002,
    clientName: 'Rafael Costa',
    barberId: 'leo',
    serviceId: 'combo',
    date: '2026-03-13',
    time: '11:00',
    status: 'pendente',
  },
  {
    id: 1003,
    clientName: 'João Victor',
    barberId: 'caue',
    serviceId: 'classic-cut',
    date: '2026-03-13',
    time: '14:00',
    status: 'concluido',
  },
  {
    id: 1004,
    clientName: 'Felipe Almeida',
    barberId: 'igor',
    serviceId: 'beard-care',
    date: '2026-03-14',
    time: '10:00',
    status: 'confirmado',
  },
  {
    id: 1005,
    clientName: 'Bruno Ferreira',
    barberId: 'leo',
    serviceId: 'hydration',
    date: '2026-03-14',
    time: '15:30',
    status: 'cancelado',
  },
  {
    id: 1006,
    clientName: 'André Luiz',
    barberId: 'caue',
    serviceId: 'combo',
    date: '2026-03-15',
    time: '13:30',
    status: 'confirmado',
  },
]

export const highlights = [
  { value: '3', label: 'barbeiros em escala' },
  { value: '6', label: 'serviços no catálogo' },
  { value: '12h', label: 'janela diária para agendamento' },
  { value: '100%', label: 'fluxo front com mocks' },
]

export const testimonials = [
  {
    id: 1,
    name: 'Diego A.',
    quote: 'O agendamento ficou direto ao ponto. Em menos de dois minutos eu já saí com horário fechado.',
  },
  {
    id: 2,
    name: 'Marcos R.',
    quote: 'A visão da agenda está clara e ajuda a não embolar a rotina da barbearia.',
  },
  {
    id: 3,
    name: 'Vinícius P.',
    quote: 'Curti o visual e a organização das etapas. Não parece um sistema improvisado.',
  },
]

export const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '18:00',
  '18:30',
]

export const statusLabels = {
  confirmado: 'Confirmado',
  pendente: 'Pendente',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatLongDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}