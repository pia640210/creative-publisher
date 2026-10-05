#!/usr/bin/env node
// 建置：node build.js → 產生 dist/（純靜態 HTML，可直接放到 GitHub Pages 或任何主機）
// 不需要安裝任何套件。
const fs = require('fs');
const path = require('path');
const C = require('./src/config');
const { books } = require('./src/data/books');
const { topics } = require('./src/data/taxonomy');
const home = require('./src/pages/home');
const bookPage = require('./src/pages/book');
const { booksIndex, topicsIndex, topicPage } = require('./src/pages/catalog');
const { author, editorial, bookClub, about, contact } = require('./src/pages/info');
const { order, thankYou, notFound, legacyRedirect } = require('./src/pages/order');

const OUT = path.join(__dirname, 'dist');
fs.rmSync(OUT, { recursive: true, force: true });

const written = [];
function write(urlPath, html, { sitemap = true } = {}) {
  const file = urlPath.endsWith('.html') ? path.join(OUT, urlPath) : path.join(OUT, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  if (sitemap) written.push(urlPath);
}
const ctxFor = urlPath => ({ root: urlPath === '' ? './' : '../'.repeat(urlPath.split('/').filter(Boolean).length) });

write('', home(ctxFor('')));
write('books/', booksIndex(ctxFor('books/')));
for (const b of books) write(`books/${b.slug}/`, bookPage(ctxFor(`books/${b.slug}/`), b));
write('topics/', topicsIndex(ctxFor('topics/')));
for (const t of topics) write(`topics/${t.slug}/`, topicPage(ctxFor(`topics/${t.slug}/`), t));
write('author/helen-chen/', author(ctxFor('author/helen-chen/')));
write('editorial/', editorial(ctxFor('editorial/')));
write('book-club/', bookClub(ctxFor('book-club/')));
write('about/', about(ctxFor('about/')));
write('contact/', contact(ctxFor('contact/')));
write('order/', order(ctxFor('order/')));
write('order/thank-you/', thankYou(ctxFor('order/thank-you/')), { sitemap: false });
write('404.html', notFound({ root: '/' }), { sitemap: false });
write('purchase.html', legacyRedirect('order/', '線上訂購'), { sitemap: false });
write('contact.html', legacyRedirect('contact/', '聯絡我們'), { sitemap: false });

// 靜態資源
function copyDir(src, dst) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
  return true;
}
copyDir(path.join(__dirname, 'assets'), path.join(OUT, 'assets'));
const hasImages = copyDir(path.join(__dirname, 'images'), path.join(OUT, 'images'));
fs.copyFileSync(path.join(__dirname, 'favicon.svg'), path.join(OUT, 'favicon.svg'));
if (fs.existsSync(path.join(__dirname, 'CNAME'))) fs.copyFileSync(path.join(__dirname, 'CNAME'), path.join(OUT, 'CNAME'));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written.map(p => `  <url><loc>${C.SITE_URL}/${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /order/thank-you/\nSitemap: ${C.SITE_URL}/sitemap.xml\n`);

console.log(`✓ ${written.length} 個頁面已建置到 dist/`);
if (!hasImages) console.log('⚠ 找不到 images/ 資料夾：請把原本網站的 images/ 放到專案根目錄後重新建置。');
