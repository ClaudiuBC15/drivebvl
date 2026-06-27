import { getDB, queryAll, execute } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

// GET: public query to list instructors
export async function GET(context: any) {
  const db = getDB(context.locals);
  try {
    const instructors = await queryAll(db, 'SELECT * FROM instructors ORDER BY sort_order ASC');
    return new Response(JSON.stringify({ success: true, instructors }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

// POST: authenticated query to add instructor
export async function POST(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

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
      `INSERT INTO instructors (name, role, categories, experience, hours, students, tags, image_url, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        role || 'Instructor Auto',
        categories || 'B',
        experience || '1+ ani',
        hours || '100+',
        students || '50+',
        serializeTags(tags),
        image_url || '',
        sort_order || 0
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
