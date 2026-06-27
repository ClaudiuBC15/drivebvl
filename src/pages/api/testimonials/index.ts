import { getDB, queryAll, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function GET(context: any) {
  const db = getDB(context.locals);
  try {
    const testimonials = await queryAll(db, 'SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC');
    return new Response(JSON.stringify({ success: true, testimonials }), {
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

export async function POST(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = getDB(context.locals);
  try {
    const { name, text, rating, image_url, source, sort_order } = await context.request.json();

    if (!name || !text) {
      return new Response(JSON.stringify({ success: false, error: 'Numele și textul sunt obligatorii' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await execute(
      db,
      'INSERT INTO testimonials (name, text, rating, image_url, source, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, text, rating ?? 5, image_url || null, source || 'Google', sort_order || 0]
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
