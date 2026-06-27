import { logoutCookie } from '../../../lib/auth';

export const prerender = false;

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': logoutCookie()
    }
  });
}

// Support GET logout just in case
export async function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/login',
      'Set-Cookie': logoutCookie()
    }
  });
}
