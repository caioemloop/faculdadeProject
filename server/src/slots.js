const STEP_MINUTES = 30
const LUNCH_START = 12 * 60
const LUNCH_END = 13 * 60

export function toMinutes(value) {
  const [hour, minute] = value.split(':').map(Number)
  return hour * 60 + minute
}

function fromMinutes(total) {
  const hour = String(Math.floor(total / 60)).padStart(2, '0')
  const minute = String(total % 60).padStart(2, '0')
  return `${hour}:${minute}`
}

export function addDays(isoDate, days) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function bahiaNowMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Bahia',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const hour = Number(parts.find((part) => part.type === 'hour').value)
  const minute = Number(parts.find((part) => part.type === 'minute').value)
  return hour * 60 + minute
}

export function generateSlots(shiftStart, shiftEnd) {
  const start = toMinutes(shiftStart)
  const end = toMinutes(shiftEnd)
  const slots = []

  for (let cursor = start; cursor < end; cursor += STEP_MINUTES) {
    if (cursor >= LUNCH_START && cursor < LUNCH_END) continue
    slots.push(fromMinutes(cursor))
  }

  return slots
}

export function listSlots({ shiftStart, shiftEnd, date, today, nowMinutes, occupied }) {
  return generateSlots(shiftStart, shiftEnd).map((time) => {
    const past = date < today || (date === today && toMinutes(time) <= nowMinutes)
    return {
      time,
      available: !past && !occupied.has(time),
    }
  })
}

export function findNextOpenSlot({ barbers, occupiedKeys, today, nowMinutes, days = 14 }) {
  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(today, offset)

    for (const barber of barbers) {
      for (const time of generateSlots(barber.shiftStart, barber.shiftEnd)) {
        if (date === today && toMinutes(time) <= nowMinutes) continue
        if (occupiedKeys.has(`${barber.id}|${date}|${time}`)) continue

        return {
          date,
          time,
          barberId: barber.id,
          barberName: barber.name,
        }
      }
    }
  }

  return null
}
