import { getDB, queryAll, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

// GET: list all leads (requires auth)
export async function GET(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDB(context.locals);
    const leads = await queryAll(db, 'SELECT * FROM leads ORDER BY created_at DESC');
    return new Response(JSON.stringify({ success: true, leads }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST: insert a new lead (public)
export async function POST(context: any) {
  try {
    const { name, phone, category, message, source } = await context.request.json();

    if (!name || !phone) {
      return new Response(JSON.stringify({ success: false, error: 'Numele și telefonul sunt obligatorii' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = getDB(context.locals);
    await execute(
      db,
      `INSERT INTO leads (name, phone, category, message, status, source) 
       VALUES (?, ?, ?, ?, 'nou', ?)`,
      [name, phone, category || '', message || '', source || 'website']
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
