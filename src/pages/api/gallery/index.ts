import { getDB, queryAll, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

// GET: public query to list gallery images
export async function GET(context: any) {
  const db = getDB(context.locals);
  try {
    // Auto-create object_position column on the fly if not exists
    try {
      await execute(db, "ALTER TABLE gallery_images ADD COLUMN object_position TEXT DEFAULT 'center'");
    } catch (e) {}

    const images = await queryAll(db, 'SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC');
    return new Response(JSON.stringify({ success: true, images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

// POST: authenticated query to add a gallery image
export async function POST(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const db = getDB(context.locals);
  try {
    const { image_url, album, caption, sort_order, media_type, video_url, layout_size, object_position } = await context.request.json();

    if (!image_url) {
      return new Response(JSON.stringify({ success: false, error: 'URL-ul imaginii este obligatoriu' }), { status: 400 });
    }

    // Auto-create object_position column on the fly if not exists
    try {
      await execute(db, "ALTER TABLE gallery_images ADD COLUMN object_position TEXT DEFAULT 'center'");
    } catch (e) {}

    await execute(
      db,
      'INSERT INTO gallery_images (image_url, album, caption, sort_order, media_type, video_url, layout_size, object_position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        image_url,
        album || 'general',
        caption !== undefined ? caption : '',
        sort_order || 0,
        media_type || 'image',
        video_url || null,
        layout_size || 'normal',
        object_position || 'center'
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
