import cors from 'cors'
import express from 'express'
import { pool } from './db.js'
import { addDays, bahiaNowMinutes, findNextOpenSlot, generateSlots, listSlots, toMinutes } from './slots.js'

const STATUSES = new Set(['confirmado', 'pendente', 'concluido', 'cancelado'])
const PORT = Number(process.env.PORT || 4107)

const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: ['http://localhost:5184', 'http://127.0.0.1:5184'] }))
app.use(express.json())

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

async function ensureShop() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      hours TEXT NOT NULL
    )
  `)
  await pool.query(`
    INSERT INTO shop (id, name, address, hours)
    VALUES (
      1,
      'Emerson Barber Shop',
      'Rua da Saboaria, 103 • Boa Vista de Sao Caetano, Salvador - BA',
      'Terça a sábado, das 9h às 20h'
    )
    ON CONFLICT (id) DO NOTHING
  `)
}

async function currentDate() {
  const { rows } = await pool.query(`SELECT to_char(CURRENT_DATE, 'YYYY-MM-DD') AS today`)
  return rows[0].today
}

function mapAppointment(row) {
  return {
    id: row.id,
    clientName: row.clientName,
    phone: row.phone,
    barberId: row.barberId,
    serviceId: row.serviceId,
    date: row.date,
    time: row.time,
    status: row.status,
  }
}

const appointmentSelect = `
  SELECT
    id,
    client_name AS "clientName",
    phone,
    barber_id AS "barberId",
    service_id AS "serviceId",
    to_char(appointment_date, 'YYYY-MM-DD') AS date,
    to_char(appointment_time, 'HH24:MI') AS time,
    status
  FROM appointments
`

async function loadBarbers() {
  const { rows } = await pool.query(`
    SELECT
      id,
      name,
      initials,
      specialty,
      experience,
      to_char(shift_start, 'HH24:MI') AS "shiftStart",
      to_char(shift_end, 'HH24:MI') AS "shiftEnd",
      to_char(shift_start, 'HH24:MI') || ' às ' || to_char(shift_end, 'HH24:MI') AS shift
    FROM barbers
    ORDER BY shift_start, name
  `)
  return rows
}

app.get('/api/shop', asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT name, address, hours
    FROM shop
    WHERE id = 1
  `)
  if (!rows[0]) {
    throw new HttpError(404, 'Dados da barbearia não encontrados')
  }
  res.json(rows[0])
}))

app.get('/api/health', asyncHandler(async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true })
}))

app.get('/api/services', asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(`
    SELECT id, name, price::float8 AS price, duration_minutes AS duration, badge, description
    FROM services
    ORDER BY sort_order, name
  `)
  res.json(rows)
}))

app.get('/api/barbers', asyncHandler(async (_req, res) => {
  res.json(await loadBarbers())
}))

app.get('/api/appointments', asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(`${appointmentSelect} ORDER BY appointment_date, appointment_time, id`)
  res.json(rows.map(mapAppointment))
}))

app.get('/api/slots', asyncHandler(async (req, res) => {
  const barberId = String(req.query.barberId || '')
  const date = String(req.query.date || '')

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new HttpError(400, 'Informe uma data válida')
  }

  const barbers = await loadBarbers()
  const barber = barbers.find((item) => item.id === barberId)
  if (!barber) {
    throw new HttpError(404, 'Barbeiro não encontrado')
  }

  const today = await currentDate()
  if (date < today || date > addDays(today, 60)) {
    throw new HttpError(400, 'A data precisa estar entre hoje e os próximos 60 dias')
  }

  const { rows } = await pool.query(
    `
      SELECT to_char(appointment_time, 'HH24:MI') AS time
      FROM appointments
      WHERE barber_id = $1
        AND appointment_date = $2
        AND status <> 'cancelado'
    `,
    [barberId, date],
  )

  res.json({
    slots: listSlots({
      shiftStart: barber.shiftStart,
      shiftEnd: barber.shiftEnd,
      date,
      today,
      nowMinutes: bahiaNowMinutes(),
      occupied: new Set(rows.map((row) => row.time)),
    }),
  })
}))

app.get('/api/next-slot', asyncHandler(async (_req, res) => {
  const today = await currentDate()
  const horizon = addDays(today, 14)
  const barbers = await loadBarbers()
  const { rows } = await pool.query(
    `
      SELECT
        barber_id AS "barberId",
        to_char(appointment_date, 'YYYY-MM-DD') AS date,
        to_char(appointment_time, 'HH24:MI') AS time
      FROM appointments
      WHERE status <> 'cancelado'
        AND appointment_date BETWEEN $1 AND $2
    `,
    [today, horizon],
  )

  const slot = findNextOpenSlot({
    barbers,
    occupiedKeys: new Set(rows.map((row) => `${row.barberId}|${row.date}|${row.time}`)),
    today,
    nowMinutes: bahiaNowMinutes(),
  })

  res.json({ slot })
}))

app.post('/api/appointments', asyncHandler(async (req, res) => {
  const clientName = String(req.body?.clientName || '').trim()
  const phone = String(req.body?.phone || '').trim()
  const barberId = String(req.body?.barberId || '')
  const serviceId = String(req.body?.serviceId || '')
  const date = String(req.body?.date || '')
  const time = String(req.body?.time || '')

  if (clientName.length < 3) {
    throw new HttpError(400, 'Informe o nome completo do cliente')
  }
  if (phone.replace(/\D/g, '').length < 8) {
    throw new HttpError(400, 'Informe um telefone válido')
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    throw new HttpError(400, 'Data ou horário inválido')
  }

  const barbers = await loadBarbers()
  const barber = barbers.find((item) => item.id === barberId)
  if (!barber) {
    throw new HttpError(400, 'Barbeiro não encontrado')
  }

  const service = await pool.query('SELECT id FROM services WHERE id = $1', [serviceId])
  if (!service.rowCount) {
    throw new HttpError(400, 'Serviço não encontrado')
  }

  const today = await currentDate()
  if (date < today || date > addDays(today, 60)) {
    throw new HttpError(400, 'A data precisa estar entre hoje e os próximos 60 dias')
  }

  const allowed = new Set(generateSlots(barber.shiftStart, barber.shiftEnd))
  if (!allowed.has(time)) {
    throw new HttpError(400, 'Esse horário está fora da escala do barbeiro')
  }

  if (date === today && toMinutes(time) <= bahiaNowMinutes()) {
    throw new HttpError(409, 'Esse horário já passou')
  }

  try {
    const { rows } = await pool.query(
      `
        INSERT INTO appointments (client_name, phone, barber_id, service_id, appointment_date, appointment_time, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'confirmado')
        RETURNING
          id,
          client_name AS "clientName",
          phone,
          barber_id AS "barberId",
          service_id AS "serviceId",
          to_char(appointment_date, 'YYYY-MM-DD') AS date,
          to_char(appointment_time, 'HH24:MI') AS time,
          status
      `,
      [clientName, phone, barberId, serviceId, date, time],
    )
    res.status(201).json(mapAppointment(rows[0]))
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'Esse horário já está ocupado para o barbeiro escolhido')
    }
    throw error
  }
}))

app.patch('/api/appointments/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const status = String(req.body?.status || '')

  if (!Number.isInteger(id)) {
    throw new HttpError(400, 'Agendamento inválido')
  }
  if (!STATUSES.has(status)) {
    throw new HttpError(400, 'Status inválido')
  }

  const current = await pool.query(
    `
      SELECT id, barber_id, appointment_date, appointment_time, status
      FROM appointments
      WHERE id = $1
    `,
    [id],
  )
  if (!current.rowCount) {
    throw new HttpError(404, 'Agendamento não encontrado')
  }

  if (status !== 'cancelado') {
    const conflict = await pool.query(
      `
        SELECT id
        FROM appointments
        WHERE barber_id = $1
          AND appointment_date = $2
          AND appointment_time = $3
          AND status <> 'cancelado'
          AND id <> $4
      `,
      [current.rows[0].barber_id, current.rows[0].appointment_date, current.rows[0].appointment_time, id],
    )
    if (conflict.rowCount) {
      throw new HttpError(409, 'Já existe outra reserva ativa nesse horário')
    }
  }

  try {
    const { rows } = await pool.query(
      `
        UPDATE appointments
        SET status = $2
        WHERE id = $1
        RETURNING
          id,
          client_name AS "clientName",
          phone,
          barber_id AS "barberId",
          service_id AS "serviceId",
          to_char(appointment_date, 'YYYY-MM-DD') AS date,
          to_char(appointment_time, 'HH24:MI') AS time,
          status
      `,
      [id, status],
    )
    res.json(mapAppointment(rows[0]))
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'Já existe outra reserva ativa nesse horário')
    }
    throw error
  }
}))

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

app.use((error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message })
    return
  }

  if (error instanceof SyntaxError && error.status === 400) {
    res.status(400).json({ message: 'JSON inválido' })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

async function start() {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await pool.query('SELECT 1')
      await ensureShop()
      break
    } catch (error) {
      if (attempt === 20) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API da Emerson Barber Shop ouvindo na porta ${PORT}`)
  })
}

start().catch((error) => {
  console.error(error)
  process.exit(1)
})
