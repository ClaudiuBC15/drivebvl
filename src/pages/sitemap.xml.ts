import { getDB, queryAll } from '../lib/db';

export const prerender = false;

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Helper to resolve absolute image URL
function resolveImageUrl(baseUrl: string, imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}

// Helper to parse dates and return the latest one in YYYY-MM-DD format
function getLatestDate(...dates: (string | null | undefined)[]): string | undefined {
  const parsed = dates
    .map(d => d ? new Date(d.replace(' ', 'T')).getTime() : 0)
    .filter(t => !isNaN(t) && t > 0);
  if (parsed.length === 0) return undefined;
  const maxTime = Math.max(...parsed);
  return new Date(maxTime).toISOString().split('T')[0];
}

// Helper to format a single date to YYYY-MM-DD
function formatDate(dateStr: string | null | undefined): string | undefined {
  if (!dateStr) return undefined;
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[0];
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {}
  return undefined;
}

// Helper to slugify category names (strips diacritics and special characters)
function slugifyCategory(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export async function GET(context: any) {
  const db = getDB(context.locals);
  
  let categories: any[] = [];
  let articles: any[] = [];
  let blogCategories: any[] = [];
  
  let maxInstructorDateStr: string | null = null;
  let maxFaqDateStr: string | null = null;
  let maxCategoryDateStr: string | null = null;
  let maxArticleDateStr: string | null = null;
  
  try {
    // 1. Fetch resources with details needed for sitemap URLs
    categories = await queryAll<any>(db, 'SELECT slug, image_url, updated_at FROM categories');
    articles = await queryAll<any>(db, "SELECT slug, category, image_url, updated_at FROM articles WHERE status = 'published'");
    blogCategories = await queryAll<any>(db, "SELECT DISTINCT category FROM articles WHERE status = 'published' AND category IS NOT NULL AND category != ''");
    
    // 2. Optimized SQL queries to get max updated/created dates
    const maxInstructor = await queryAll<{ latest: string }>(db, 'SELECT MAX(updated_at) as latest FROM instructors');
    maxInstructorDateStr = maxInstructor[0]?.latest || null;
    
    const maxFaq = await queryAll<{ latest: string }>(db, 'SELECT MAX(created_at) as latest FROM faqs');
    maxFaqDateStr = maxFaq[0]?.latest || null;

    const maxCategory = await queryAll<{ latest: string }>(db, 'SELECT MAX(updated_at) as latest FROM categories');
    maxCategoryDateStr = maxCategory[0]?.latest || null;

    const maxArticle = await queryAll<{ latest: string }>(db, "SELECT MAX(updated_at) as latest FROM articles WHERE status = 'published'");
    maxArticleDateStr = maxArticle[0]?.latest || null;
  } catch (err) {
    console.error('Error fetching sitemap data:', err);
  }
  
  const baseUrl = 'https://startdrivebvl.ro';
  const STATIC_LASTMOD = '2026-07-15'; // Last updated code/template date
  
  // Calculate dynamic latest dates safely
  const latestArticleDate = formatDate(maxArticleDateStr);
  const latestCategoryDate = formatDate(maxCategoryDateStr);
  const latestInstructorDate = formatDate(maxInstructorDateStr);
  const latestFaqDate = formatDate(maxFaqDateStr);
  
  const globalLatestDate = getLatestDate(
    maxArticleDateStr, 
    maxCategoryDateStr, 
    maxInstructorDateStr, 
    maxFaqDateStr,
    STATIC_LASTMOD
  ) || STATIC_LASTMOD;

  // Helper to get latest article update date in a specific blog category
  const getLatestBlogCategoryDate = (catName: string) => {
    const dates = articles
      .filter(a => a.category && a.category.toUpperCase() === catName.toUpperCase())
      .map(a => a.updated_at)
      .filter(Boolean);
    return getLatestDate(...dates);
  };

  // 1. Static/Listing pages config
  const staticUrls = [
    { url: '', priority: '1.0', lastmod: globalLatestDate },
    { url: '/categorii', priority: '0.9', lastmod: latestCategoryDate || STATIC_LASTMOD },
    { url: '/blog', priority: '0.8', lastmod: latestArticleDate || STATIC_LASTMOD },
    { url: '/inscrieri', priority: '0.8', lastmod: latestCategoryDate || STATIC_LASTMOD },
    { url: '/instructori', priority: '0.7', lastmod: latestInstructorDate || STATIC_LASTMOD },
    { url: '/intrebari-frecvente', priority: '0.7', lastmod: latestFaqDate || STATIC_LASTMOD },
    { url: '/galerie', priority: '0.6', lastmod: STATIC_LASTMOD },
    { url: '/contact', priority: '0.6', lastmod: STATIC_LASTMOD },
    { url: '/politica-confidentialitate', priority: '0.3', lastmod: STATIC_LASTMOD },
    { url: '/termeni-conditii', priority: '0.3', lastmod: STATIC_LASTMOD }
  ];
  
  // Build items list
  const sitemapItems: any[] = [];

  // Add static URLs
  for (const item of staticUrls) {
    sitemapItems.push({
      loc: `${baseUrl}${item.url}`,
      priority: item.priority,
      lastmod: item.lastmod,
      images: []
    });
  }

  // Add driving categories
  for (const cat of categories) {
    sitemapItems.push({
      loc: `${baseUrl}/categoria/${cat.slug}`,
      priority: '0.9',
      lastmod: formatDate(cat.updated_at) || STATIC_LASTMOD,
      images: cat.image_url ? [resolveImageUrl(baseUrl, cat.image_url)].filter(Boolean) : []
    });
  }

  // Add published blog articles
  for (const art of articles) {
    sitemapItems.push({
      loc: `${baseUrl}/blog/${art.slug}`,
      priority: '0.8',
      lastmod: formatDate(art.updated_at) || STATIC_LASTMOD,
      images: art.image_url ? [resolveImageUrl(baseUrl, art.image_url)].filter(Boolean) : []
    });
  }

  // Add blog categories listing pages
  for (const bCat of blogCategories) {
    const catSlug = slugifyCategory(bCat.category);
    sitemapItems.push({
      loc: `${baseUrl}/blog/categorie/${catSlug}`,
      priority: '0.7',
      lastmod: getLatestBlogCategoryDate(bCat.category) || STATIC_LASTMOD,
      images: []
    });
  }
  
  // Generate the XML output with Google Image Sitemap support
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${sitemapItems.map(item => `
  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <priority>${item.priority}</priority>${item.images && item.images.length > 0 ? item.images.map((imgUrl: string) => `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
    </image:image>`).join('') : ''}
  </url>`).join('').trim()}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
