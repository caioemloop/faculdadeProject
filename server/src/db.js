import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não foi definida')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: '-c timezone=America/Bahia',
})
