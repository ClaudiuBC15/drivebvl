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
    const { status } = await context.request.json();
    await execute(
      db,
      'UPDATE leads SET status = ?, updated_at = datetime(\'now\') WHERE id = ?',
      [status, id]
    );

    return new Response(JSON.stringify({ success: true }), {
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

export async function DELETE(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = context.params;
  const db = getDB(context.locals);

  try {
    await execute(db, 'DELETE FROM leads WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), {
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
