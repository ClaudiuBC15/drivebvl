import { getDB, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function PUT(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = context.params;
  const db = getDB(context.locals);

  try {
    const { name, role, categories, experience, hours, students, tags, image_url, sort_order } = await context.request.json();

    if (!name) {
      return new Response(JSON.stringify({ success: false, error: 'Numele este obligatoriu' }), { status: 400 });
    }

    const serializeTags = (val: any) => {
      if (!val) return '[]';
      if (typeof val === 'string') {
        try {
          JSON.parse(val);
          return val;
        } catch {
          return JSON.stringify([val]);
        }
      }
      return JSON.stringify(val);
    };

    await execute(
      db,
      `UPDATE instructors 
       SET name = ?, role = ?, categories = ?, experience = ?, hours = ?, students = ?, tags = ?, image_url = ?, sort_order = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        name,
        role || 'Instructor Auto',
        categories || 'B',
        experience || '1+ ani',
        hours || '100+',
        students || '50+',
        serializeTags(tags),
        image_url || '',
        sort_order || 0,
        id
      ]
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function DELETE(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = context.params;
  const db = getDB(context.locals);

  try {
    await execute(db, 'DELETE FROM instructors WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
