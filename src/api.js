export function loadAgenda() {
  return Promise.all([
    api('/api/shop'),
    api('/api/services'),
    api('/api/barbers'),
    api('/api/appointments'),
    api('/api/next-slot'),
  ]).then(([shop, services, barbers, appointments, nextSlot]) => ({
    shop,
    services,
    barbers,
    appointments,
    nextSlot: nextSlot.slot,
  }))
}

export async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Falha na comunicação com o servidor')
  }

  return data
}
