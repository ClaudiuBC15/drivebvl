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
    const { 
      hero_title, 
      hero_subtitle, 
      description, 
      what_you_can_drive, 
      conditions, 
      documents, 
      duration_info, 
      info_note, 
      testimonials,
      graduate_images,
      image_url, 
      seo_title, 
      seo_description 
    } = await context.request.json();

    // In SQLite, JSON arrays are stored as text. We ensure they are serialized.
    const serializeField = (field: any) => {
      if (!field) return '[]';
      if (typeof field === 'string') {
        try {
          JSON.parse(field); // Check if already valid JSON string
          return field;
        } catch {
          return JSON.stringify([field]);
        }
      }
      return JSON.stringify(field);
    };

    await execute(
      db,
      `UPDATE categories 
       SET hero_title = ?, hero_subtitle = ?, description = ?, what_you_can_drive = ?, conditions = ?, documents = ?, duration_info = ?, info_note = ?, testimonials = ?, graduate_images = ?, image_url = ?, seo_title = ?, seo_description = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        hero_title || '',
        hero_subtitle || '',
        serializeField(description),
        serializeField(what_you_can_drive),
        serializeField(conditions),
        serializeField(documents),
        duration_info || '',
        info_note || '',
        serializeField(testimonials),
        serializeField(graduate_images),
        image_url || '',
        seo_title || '',
        seo_description || '',
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
