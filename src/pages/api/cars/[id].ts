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
    const { model, tag, image_url, sort_order } = await context.request.json();

    if (!model || !tag) {
      return new Response(JSON.stringify({ success: false, error: 'Modelul și transmisia/tag-ul sunt obligatorii' }), { status: 400 });
    }

    await execute(
      db,
      `UPDATE cars 
       SET model = ?, tag = ?, image_url = ?, sort_order = ?
       WHERE id = ?`,
      [
        model,
        tag,
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
    await execute(db, 'DELETE FROM cars WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
