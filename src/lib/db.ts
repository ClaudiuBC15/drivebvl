/**
 * D1 Database helper for Cloudflare Workers / Astro hybrid mode.
 * Provides typed access to the D1 binding from Astro API routes.
 */

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

/**
 * Get the D1 database instance from an Astro context.
 * Works both in production (Cloudflare Workers) and local dev (wrangler proxy).
 */
export function getDB(locals: App.Locals): D1Database {
  const runtime = (locals as any).runtime;
  if (!runtime?.env?.DB) {
    throw new Error('D1 database binding not found. Make sure wrangler.toml is configured.');
  }
  return runtime.env.DB as D1Database;
}

/** Run a SELECT query and return all results */
export async function queryAll<T>(db: D1Database, sql: string, params: unknown[] = []): Promise<T[]> {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const result = await bound.all<T>();
  return result.results;
}

/** Run a SELECT query and return the first result */
export async function queryOne<T>(db: D1Database, sql: string, params: unknown[] = []): Promise<T | null> {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  return await bound.first<T>();
}

/** Run an INSERT/UPDATE/DELETE and return the result */
export async function execute(db: D1Database, sql: string, params: unknown[] = []) {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  return await bound.run();
}

/** JSON parse helper with fallback */
export function parseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
