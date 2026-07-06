import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // Proceed with the request
  const response = await next();
  
  // 1. Apply Cache-Control headers to GET/HEAD requests
  const method = context.request.method;
  if (method === "GET" || method === "HEAD") {
    // If the response already has Cache-Control (e.g., sitemap, uploads API), don't overwrite it
    if (!response.headers.has("Cache-Control")) {
      if (pathname.startsWith("/admin")) {
        response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      } else if (pathname.startsWith("/api")) {
        response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
      } else if (pathname.startsWith("/blog")) {
        // Blog index, categories or articles: Cache heavily at Edge
        response.headers.set("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600");
      } else if (pathname.startsWith("/categoria") || pathname === "/categorii") {
        // Categories pages: Cache at Edge
        response.headers.set("Cache-Control", "public, max-age=0, s-maxage=36000, stale-while-revalidate=1200");
      } else if (pathname === "/inscrieri") {
        // Form page: Cache briefly
        response.headers.set("Cache-Control", "public, max-age=0, s-maxage=1800, stale-while-revalidate=300");
      } else {
        // Other public pages (Home, FAQ, Galerie, Contact, Instructori, etc.)
        response.headers.set("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=600");
      }
    }
  } else {
    // For POST/PUT/DELETE, ensure no-cache
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
  }

  // 2. Apply Security Headers for HTML responses
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self \"https://startdrivebvl.ro\")");
  }

  return response;
});
