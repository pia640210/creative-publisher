const fs = require('fs');
const path = require('path');
const C = require('../config');
const { esc, asset, link } = require('./layout');
const { byKey } = require('../data/books');

const bookUrl = (ctx, b) => link(ctx, `books/${b.slug}/`);

// 書封：書是長方形的實物，所以只有極小圓角、左側一道書背陰影
function cover(ctx, b, { size = 'm', eager = false, img } = {}) {
  return `<span class="cover cover-${size}"><img src="${asset(ctx, img || b.img)}" alt="《${esc(b.title)}》書封" width="300" height="400" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>`;
}

// 書籍條目：書封 + 讀者入口句。點整本書進書籍頁
function bookItem(ctx, key, { showHook = true, headingLevel = 3 } = {}) {
  const b = byKey[key];
  const h = `h${headingLevel}`;
  return `<article class="book-item">
  <a class="book-link" href="${bookUrl(ctx, b)}" data-track="book_click" data-book="${b.key}">
    ${cover(ctx, b)}
    <${h} class="book-title">${esc(b.title)}${b.isSeries ? `<span class="vol"> ${b.volumesLabel}</span>` : ''}</${h}>
    ${showHook ? `<p class="book-hook">${esc(b.hook)}</p>` : ''}
  </a>
</article>`;
}

function bookList(ctx, keys, opts = {}) {
  return `<div class="book-list${opts.shelf ? ' shelf' : ''}">${keys.map(k => bookItem(ctx, k, opts)).join('')}</div>`;
}

function buyLinks(links, cls = '') {
  if (!links || !links.length) return '';
  return `<ul class="store-links ${cls}">${links.map(([name, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener" data-track="outbound_bookstore" data-store="${esc(name)}">${esc(name)}</a></li>`).join('')}</ul>`;
}

function reviewList(reviews) {
  if (!reviews || !reviews.length) return '';
  return `<div class="reviews">${reviews.map(r => `<figure class="review"><blockquote><p>${esc(r.text)}</p></blockquote><figcaption>${esc(r.name)}${r.vol ? `，讀《${esc(r.vol)}》` : ''}</figcaption></figure>`).join('')}</div>`;
}

// 優惠方案：三種並列，中間推薦
function offers(ctx, { compact = false } = {}) {
  const o = C.OFFERS;
  return `<section class="offers${compact ? ' offers-compact' : ''}" aria-labelledby="offers-title">
  <div class="wrap">
    <h2 id="offers-title" class="h3">直接向出版社訂購的優惠</h2>
    <ul class="offer-list">
      <li><span class="offer-name">任選 3 本</span><span class="offer-price">NT$${o.three.toLocaleString()}</span><span class="offer-note">全部書籍都可以選</span></li>
      <li class="offer-best"><span class="offer-name">買五送一</span><span class="offer-price">NT$${o.six.toLocaleString()}</span><span class="offer-note">任選 6 本，最划算</span></li>
      <li><span class="offer-name">說話的藝術套書</span><span class="offer-price">NT$${o.artSet.toLocaleString()}</span><span class="offer-note">全 3 冊</span></li>
    </ul>
    <p class="offer-foot">訂購單會自動幫你套用最划算的組合。 <a class="btn btn-primary" href="${link(ctx, 'order/')}" data-track="order_cta">開始選書</a></p>
  </div>
</section>`;
}

// 營業時間提示：JS 依台北時間切換「可以來電」或「改用 Email／訂購單」
function hoursNote(ctx) {
  return `<p class="hours-note" data-hours-note>
  <span data-open>現在是營業時間，歡迎來電 <a href="tel:${C.PHONE_TEL}" data-track="tel_click">${C.PHONE}</a></span>
  <span data-closed hidden>目前電話休息中。可以寄 Email 到 <a href="mailto:${C.EMAIL}" data-track="email_click">${C.EMAIL}</a>，或填 <a href="${link(ctx, 'order/')}">線上訂購單</a>，我們上班後會盡快回覆。</span>
</p>`;
}

// 電子報：沿用舊站 Kit 表單（表單 ID 不變，訂閱者名單不受影響）
const kitForm = fs.readFileSync(path.join(__dirname, '_kit-form.html'), 'utf8');
function newsletter() {
  return `<section class="newsletter" aria-labelledby="nl-title">
  <div class="wrap narrow">
    <h2 id="nl-title">有新書和品書時間，寫信告訴你</h2>
    <p>不定期寄送，內容是生活裡用得上的方法、真實故事和書裡的片段。隨時可以取消。</p>
    ${kitForm}
  </div>
</section>`;
}

// 「你最近在想什麼？」：排成一本書的目次。沒有 JS 時連到找書頁的對應段落
// 問題入口的結果資料（給 main.js 在頁面內展開推薦）
function questionData(ctx, questions) {
  const data = {};
  for (const q of questions) data[q.key] = { text: q.text, books: q.books.map(k => { const b = byKey[k]; return { title: b.title, hook: b.hook, url: bookUrl(ctx, b), img: asset(ctx, b.img) }; }) };
  return `<script type="application/json" id="q-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function questionIndex(ctx, questions, { id = 'questions', heading = '你最近在想什麼？', headingTag = 'h2' } = {}) {
  return `<section class="toc" id="${id}" aria-labelledby="${id}-title">
  <${headingTag} id="${id}-title" class="toc-title">${heading}</${headingTag}>
  <ol class="toc-list" role="list">
    ${questions.map(q => `<li><a href="${link(ctx, 'books/')}#q-${q.key}" data-q="${q.key}" aria-controls="${id}-result" data-track="question_select"><span class="toc-text">${esc(q.text)}</span><span class="toc-dots" aria-hidden="true"></span><span class="toc-count">${q.books.length} 本</span></a></li>`).join('')}
  </ol>
  <div class="toc-result" id="${id}-result" aria-live="polite"></div>
</section>`;
}

module.exports = { questionData, bookUrl, cover, bookItem, bookList, buyLinks, reviewList, offers, hoursNote, newsletter, questionIndex };
