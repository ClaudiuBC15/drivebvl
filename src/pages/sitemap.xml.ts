import { getDB, queryAll } from '../lib/db';

export const prerender = false;

export async function GET(context: any) {
  const db = getDB(context.locals);
  
  // Fetch slugs from categories and published articles
  let categories: any[] = [];
  let articles: any[] = [];
  
  try {
    categories = await queryAll<any>(db, 'SELECT slug FROM categories');
    articles = await queryAll<any>(db, "SELECT slug FROM articles WHERE status = 'published'");
  } catch (err) {
    console.error('Error fetching sitemap data:', err);
  }
  
  const baseUrl = 'https://startdrivebvl.ro';
  
  const staticUrls = [
    '',
    '/categorii',
    '/intrebari-frecvente',
    '/galerie',
    '/instructori',
    '/contact',
    '/politica-confidentialitate',
    '/termeni-conditii',
    '/blog'
  ];
  
  const sitemapItems = [
    ...staticUrls.map(url => ({
      loc: `${baseUrl}${url}`,
      changefreq: url === '' ? 'daily' : 'weekly',
      priority: url === '' ? '1.0' : '0.8'
    })),
    ...categories.map(cat => ({
      loc: `${baseUrl}/categoria/${cat.slug}`,
      changefreq: 'weekly',
      priority: '0.9'
    })),
    ...articles.map(art => ({
      loc: `${baseUrl}/blog/${art.slug}`,
      changefreq: 'monthly',
      priority: '0.7'
    }))
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapItems.map(item => `
  <url>
    <loc>${item.loc}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('').trim()}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
