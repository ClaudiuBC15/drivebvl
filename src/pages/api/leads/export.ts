import { getDB, queryAll } from '../../../lib/db';
import { isAuthenticated } from '../../../lib/auth';

export const prerender = false;

export async function GET(context: any) {
  if (!isAuthenticated(context.request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const db = getDB(context.locals);

  try {
    const leads = await queryAll<any>(db, 'SELECT * FROM leads ORDER BY created_at DESC');
    
    // Create CSV header
    let csv = '\uFEFF'; // UTF-8 BOM to display Romanian characters correctly in Excel
    csv += 'ID,Nume Complet,Telefon,Categoria Dorită,Mesaj,Status,Sursă,Data Înscrierii\r\n';

    // Append rows
    for (const lead of leads) {
      // Escape quotes and commas in CSV strings
      const escape = (val: string) => {
        if (!val) return '';
        const clean = val.replace(/"/g, '""');
        return `"${clean}"`;
      };

      csv += `${lead.id},${escape(lead.name)},${escape(lead.phone)},${escape(lead.category)},${escape(lead.message)},${escape(lead.status)},${escape(lead.source)},${escape(lead.created_at)}\r\n`;
    }

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads-startdrive.csv"',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
