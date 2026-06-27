import { getDB, queryOne } from '../../../lib/db';

export const prerender = false;

export async function GET(context: any) {
  const { id } = context.params;
  const db = getDB(context.locals);

  try {
    const upload = await queryOne<any>(
      db,
      'SELECT mime_type, data FROM uploads WHERE id = ?',
      [id]
    );

    if (!upload || !upload.data) {
      return new Response('File Not Found', { status: 404 });
    }

    // In D1, BLOB column values are returned as ArrayBuffers or Uint8Arrays or standard Arrays of bytes
    let fileData = upload.data;
    if (fileData instanceof ArrayBuffer) {
      fileData = new Uint8Array(fileData);
    } else if (Array.isArray(fileData)) {
      fileData = new Uint8Array(fileData);
    } else if (fileData && typeof fileData === 'object') {
      if (fileData.buffer instanceof ArrayBuffer) {
        fileData = new Uint8Array(fileData.buffer, fileData.byteOffset, fileData.byteLength);
      } else if (fileData.data && Array.isArray(fileData.data)) {
        fileData = new Uint8Array(fileData.data);
      } else {
        fileData = new Uint8Array(Object.values(fileData));
      }
    }

    return new Response(fileData, {
      status: 200,
      headers: {
        'Content-Type': upload.mime_type || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
