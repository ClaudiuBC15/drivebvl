import { getDB, queryAll, queryOne, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function GET(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = getDB(context.locals);
  try {
    const articles = await queryAll(db, 'SELECT * FROM articles ORDER BY created_at DESC');
    return new Response(JSON.stringify({ success: true, articles }), {
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
      `INSERT INTO articles (title, slug, excerpt, content, category, tags, image_url, seo_title, seo_description, status, author)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        authorName
      ]
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
