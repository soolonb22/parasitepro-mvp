/**
 * Lightweight PostgreSQL client using the `pg` package.
 * Connection pool is shared across all API routes via module caching.
 *
 * Railway injects DATABASE_URL automatically.
 *
 * Schema for auth (run once in your Railway Postgres console):
 *
 * CREATE EXTENSION IF NOT EXISTS "pgcrypto";
 *
 * CREATE TABLE users (
 *   id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name            TEXT,
 *   email           TEXT UNIQUE NOT NULL,
 *   email_verified  TIMESTAMPTZ,
 *   password_hash   TEXT,                     -- NULL for OAuth users
 *   image           TEXT,                     -- avatar URL
 *   image_credits   INT NOT NULL DEFAULT 3,   -- BETA3FREE promo gives 3
 *   created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 *
 * CREATE INDEX users_email_idx ON users(email);
 *
 * -- Sessions (used only if strategy='database'; JWT strategy doesn't need this)
 * -- For JWT strategy you can skip sessions/accounts tables.
 *
 * CREATE TABLE accounts (
 *   id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   type                TEXT NOT NULL,
 *   provider            TEXT NOT NULL,
 *   provider_account_id TEXT NOT NULL,
 *   access_token        TEXT,
 *   refresh_token       TEXT,
 *   expires_at          BIGINT,
 *   token_type          TEXT,
 *   scope               TEXT,
 *   id_token            TEXT,
 *   session_state       TEXT,
 *   UNIQUE(provider, provider_account_id)
 * );
 */

import { Pool } from 'pg'

// Module-level pool — reused across hot reloads in dev
const globalForPg = globalThis as typeof globalThis & { _pgPool?: Pool }

export const pool =
  globalForPg._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPg._pgPool = pool
}

/**
 * Execute a parameterised query.
 * @example
 *   const { rows } = await query('SELECT * FROM users WHERE id=$1', [userId])
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  values?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, values)
    return { rows: result.rows as T[], rowCount: result.rowCount }
  } finally {
    client.release()
  }
}

/**
 * Convenience: fetch a single row or null.
 */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  values?: unknown[]
): Promise<T | null> {
  const { rows } = await query<T>(text, values)
  return rows[0] ?? null
}
