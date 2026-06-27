import { getDB, execute, queryOne } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function POST(context: any) {
  // Check authorization
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const db = getDB(context.locals);

  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Niciun fișier încărcat sau fișierul este gol.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filename = file.name || 'upload.bin';
    const mimeType = file.type || 'application/octet-stream';
    
    // Read buffer and convert to Uint8Array for SQLite BLOB storage
    const arrayBuffer = await file.arrayBuffer();
    const arrayBytes = new Uint8Array(arrayBuffer);

    // Insert into uploads table
    await execute(
      db,
      'INSERT INTO uploads (filename, mime_type, data) VALUES (?, ?, ?)',
      [filename, mimeType, arrayBytes]
    );

    // Fetch last inserted row ID
    const row = await queryOne<{ id: number }>(db, 'SELECT last_insert_rowid() as id');
    const insertId = row?.id;

    if (!insertId) {
      throw new Error('Nu s-a putut genera ID-ul imaginii.');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      url: `/api/uploads/${insertId}` 
    }), {
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
