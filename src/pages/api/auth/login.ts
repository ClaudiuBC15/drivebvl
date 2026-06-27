import { login } from '../../../lib/auth';

export const prerender = false;

export async function POST(context: any) {
  try {
    const { username, password } = await context.request.json();
    const env = context.locals.runtime?.env || {};
    const adminUser = env.ADMIN_USER || 'admin';
    const adminPass = env.ADMIN_PASS || 'StartDrive2025!';

    const result = login(username, password, adminUser, adminPass);

    if (result.success && result.cookie) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': result.cookie
        }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Credențiale invalide' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
