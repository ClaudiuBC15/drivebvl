import { getDB, execute, queryOne } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function PUT(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { id } = context.params;
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
      `UPDATE gallery_images 
       SET image_url = ?, album = ?, caption = ?, sort_order = ?, media_type = ?, video_url = ?, layout_size = ?, object_position = ?
       WHERE id = ?`,
      [
        image_url,
        album || 'general',
        caption !== undefined ? caption : '',
        sort_order || 0,
        media_type || 'image',
        video_url || null,
        layout_size || 'normal',
        object_position || 'center',
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
    await execute(db, 'DELETE FROM gallery_images WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
