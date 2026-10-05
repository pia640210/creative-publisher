const C = require('../config');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// 圖片與連結路徑：網站用相對路徑，部署在根目錄或子目錄都能用
const asset = (ctx, p) => ctx.root + p.split('/').map(encodeURIComponent).join('/');
const link = (ctx, p) => ctx.root + p;
const abs = p => C.SITE_URL + '/' + p.replace(/^\//, '');
const absImg = p => C.SITE_URL + '/' + p.split('/').map(encodeURIComponent).join('/');

const NAV = [
  ['books/', '找一本書', 'books'],
  ['topics/', '主題閱讀', 'topics'],
  ['author/helen-chen/', '作者', 'author'],
  ['editorial/', '一本書之外', 'editorial'],
  ['book-club/', '品書時間', 'book-club'],
  ['about/', '關於創意', 'about'],
];

const orgSchema = () => ({
  '@type': 'Organization', '@id': C.SITE_URL + '/#publisher', name: C.SITE_NAME, url: C.SITE_URL + '/',
  telephone: C.PHONE_INTL, faxNumber: '+886-2-8712-2808', email: C.EMAIL,
  address: { '@type': 'PostalAddress', streetAddress: '復興北路178號2樓', addressLocality: '台北市', addressCountry: 'TW' },
  // 營業時間：讓 Google 搜尋與地圖顯示
  contactPoint: {
    '@type': 'ContactPoint', telephone: C.PHONE_INTL, contactType: 'customer service', availableLanguage: 'zh-TW',
    hoursAvailable: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '17:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Friday'], opens: '13:00', closes: '17:00' },
    ],
  },
});

function head(ctx, p) {
  const url = abs(p.path);
  const og = absImg(p.ogImage || C.DEFAULT_OG_IMAGE);
  const graph = [orgSchema(), ...(p.schema || [])];
  if (p.crumbs) graph.push(breadcrumbSchema(p.crumbs));
  const clientCfg = { FORM_ENDPOINT: C.FORM_ENDPOINT, EMAIL: C.EMAIL, PHONE: C.PHONE, PHONE_TEL: C.PHONE_TEL, HOURS: C.HOURS, BANK: C.BANK, OFFERS: C.OFFERS, SHIPPING: C.SHIPPING, ROOT: ctx.root };
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
${p.noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${C.SITE_NAME}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="zh_TW">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF8F2">
<link rel="icon" href="${link(ctx, 'favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700&display=swap">
<link rel="stylesheet" href="${link(ctx, 'assets/css/site.css')}">
${p.preloadImg ? `<link rel="preload" as="image" href="${asset(ctx, p.preloadImg)}" fetchpriority="high">` : ''}
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
<script>window.SITE=${JSON.stringify(clientCfg)};</script>
${C.GA_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${C.GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${C.GA_ID}');</script>` : ''}
${p.headExtra || ''}
</head>`;
}

function nav(ctx, active) {
  return `<a class="skip" href="#main">跳到主要內容</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${link(ctx, '')}">創意出版社</a>
    <nav class="site-nav" aria-label="主選單">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list">選單</button>
      <ul id="nav-list" class="nav-list">
        ${NAV.map(([href, label, key]) => `<li><a href="${link(ctx, href)}"${active === key ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}
      </ul>
    </nav>
    <a class="btn btn-quiet header-order" href="${link(ctx, 'order/')}"${active === 'order' ? ' aria-current="page"' : ''}>訂購</a>
  </div>
</header>`;
}

function footer(ctx) {
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <p class="brand">創意出版社</p>
      <p>創意有心，讀者開心。<br>有些事，值得用一本書慢慢說。</p>
    </div>
    <nav aria-label="書目">
      <h2>找書</h2>
      <ul>
        <li><a href="${link(ctx, 'books/')}">全部書目</a></li>
        <li><a href="${link(ctx, 'topics/')}">主題閱讀</a></li>
        <li><a href="${link(ctx, 'author/helen-chen/')}">作者陳海倫</a></li>
        <li><a href="${link(ctx, 'editorial/')}">一本書之外</a></li>
      </ul>
    </nav>
    <nav aria-label="服務">
      <h2>服務</h2>
      <ul>
        <li><a href="${link(ctx, 'order/')}">線上訂購</a></li>
        <li><a href="${link(ctx, 'book-club/')}">品書時間</a></li>
        <li><a href="${link(ctx, 'about/')}">關於創意</a></li>
        <li><a href="${link(ctx, 'contact/')}">聯絡我們</a></li>
      </ul>
    </nav>
    <div>
      <h2>聯絡</h2>
      <p><a href="tel:${C.PHONE_TEL}" data-track="tel_click">${C.PHONE}</a><br>
      ${C.HOURS_TEXT.join('<br>')}</p>
      <p><a href="mailto:${C.EMAIL}" data-track="email_click">${C.EMAIL}</a><br>Email 隨時收件</p>
      <p>${C.ADDRESS}</p>
    </div>
  </div>
  <div class="wrap footer-base"><p>© ${new Date().getFullYear()} 創意出版社</p></div>
</footer>`;
}

function breadcrumbSchema(crumbs) {
  return { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: abs(c[1]) })) };
}

function breadcrumb(ctx, crumbs) {
  return `<nav class="crumbs wrap" aria-label="目前位置"><ol>${crumbs.map((c, i) => i === crumbs.length - 1
    ? `<li aria-current="page">${esc(c[0])}</li>`
    : `<li><a href="${link(ctx, c[1])}">${esc(c[0])}</a></li>`).join('')}</ol></nav>`;
}

// 頁面外框：每一頁都經過這裡，所以 head、導覽、footer 只寫一次
function page(ctx, p, body) {
  return `${head(ctx, p)}
<body class="${p.bodyClass || ''}">
${nav(ctx, p.active)}
<main id="main">
${p.crumbs ? breadcrumb(ctx, p.crumbs) : ''}
${body}
</main>
${footer(ctx)}
<script src="${link(ctx, 'assets/js/main.js')}" defer></script>
${(p.scripts || []).map(s => `<script src="${link(ctx, s)}" defer></script>`).join('\n')}
</body>
</html>`;
}

module.exports = { esc, asset, link, abs, absImg, page, breadcrumb };
