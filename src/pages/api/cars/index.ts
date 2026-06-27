import { getDB, queryAll, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

// GET: public query to list cars
export async function GET(context: any) {
  const db = getDB(context.locals);
  try {
    const cars = await queryAll(db, 'SELECT * FROM cars ORDER BY sort_order ASC');
    return new Response(JSON.stringify({ success: true, cars }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

// POST: authenticated query to add a car
export async function POST(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = getDB(context.locals);
  try {
    const { model, tag, image_url, sort_order } = await context.request.json();

    if (!model || !tag) {
      return new Response(JSON.stringify({ success: false, error: 'Modelul și transmisia/tag-ul sunt obligatorii' }), { status: 400 });
    }

    await execute(
      db,
      `INSERT INTO cars (model, tag, image_url, sort_order) 
       VALUES (?, ?, ?, ?)`,
      [
        model,
        tag,
        image_url || '',
        sort_order || 0
      ]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
