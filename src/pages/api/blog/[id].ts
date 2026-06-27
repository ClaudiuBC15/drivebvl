import { getDB, queryOne, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function GET(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = context.params;
  const db = getDB(context.locals);

  try {
    const article = await queryOne(db, 'SELECT * FROM articles WHERE id = ?', [id]);
    if (!article) {
      return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, article }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function PUT(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = context.params;
  const db = getDB(context.locals);

  try {
    const { title, slug, excerpt, content, category, tags, image_url, seo_title, seo_description, status } = await context.request.json();

    if (!title || !slug || !content) {
      return new Response(JSON.stringify({ success: false, error: 'Titlul, slug-ul și conținutul sunt obligatorii' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch admin name from settings
    const adminNameRow = await queryOne<{ value: string }>(db, "SELECT value FROM settings WHERE key = 'admin_name'");
    const authorName = adminNameRow?.value || 'Bivol Sergiu';

    await execute(
      db,
      `UPDATE articles 
       SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, tags = ?, image_url = ?, seo_title = ?, seo_description = ?, status = ?, author = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        title,
        slug,
        excerpt || '',
        content,
        category || 'SFATURI',
        tags ? JSON.stringify(tags) : '[]',
        image_url || '',
        seo_title || '',
        seo_description || '',
        status || 'draft',
        authorName,
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
    await execute(db, 'DELETE FROM articles WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
