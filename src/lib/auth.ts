/**
 * Simple admin authentication system using cookies.
 * Credentials are stored in environment variables (wrangler.toml).
 */

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a simple session token (hash-based).
 */
function generateToken(user: string, timestamp: number): string {
  // Simple token: base64 of user:timestamp
  // In production, use a proper HMAC with a secret
  const raw = `${user}:${timestamp}:startdrivebvl`;
  return btoa(raw);
}

/**
 * Verify admin credentials and return a session cookie header.
 */
export function login(
  username: string,
  password: string,
  envUser: string,
  envPass: string
): { success: boolean; cookie?: string } {
  if (username !== envUser || password !== envPass) {
    return { success: false };
  }

  const now = Date.now();
  const token = generateToken(username, now);
  const expires = new Date(now + SESSION_TTL).toUTCString();

  const cookie = `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`;
  return { success: true, cookie };
}

/**
 * Check if a request has a valid admin session.
 */
export function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;

  const cookies = parseCookies(cookieHeader);
  const token = cookies[SESSION_COOKIE];
  if (!token) return false;

  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length < 3) return false;

    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp)) return false;

    // Check if token is expired
    if (Date.now() - timestamp > SESSION_TTL) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Middleware: require authentication. Returns a redirect Response if not authenticated.
 */
export function requireAuth(request: Request): Response | null {
  if (isAuthenticated(request)) return null;

  return new Response(null, {
    status: 302,
    headers: { Location: '/admin/login' },
  });
}

/**
 * Create a logout cookie (expired).
 */
export function logoutCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Parse cookie header into key-value pairs.
 */
function parseCookies(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  header.split(';').forEach((cookie) => {
    const [key, ...rest] = cookie.trim().split('=');
    if (key) {
      cookies[key.trim()] = rest.join('=').trim();
    }
  });
  return cookies;
}
