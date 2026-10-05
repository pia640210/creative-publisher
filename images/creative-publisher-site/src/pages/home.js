const C = require('../config');
const { esc, link, page } = require('../components/layout');
const ui = require('../components/ui');
const { byKey } = require('../data/books');
const { questions, angles, testimonials, featured, legacyCat } = require('../data/taxonomy');
const { books } = require('../data/books');

module.exports = function home(ctx) {
  // 舊網址相容：?book=ziji、?cat=婚姻 轉到新頁面（舊站的分享連結不會失效）
  const legacyBook = Object.fromEntries(books.map(b => [b.key, `books/${b.slug}/`]));
  const legacyScript = `<script>(function(){var q=new URLSearchParams(location.search),b=q.get('book'),c=q.get('cat'),B=${JSON.stringify(legacyBook)},T=${JSON.stringify(legacyCat)};if(b&&B[b]){location.replace(B[b]);}else if(c&&T[c]){location.replace('topics/'+T[c]+'/');}})();</script>`;

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-inner">
    <h1 id="hero-title" class="hero-title">有些事，<br>短影音說不完。</h1>
    <p class="hero-sub">關於自己、家人、伴侶和人生方向，這裡的書不給公式。陪你換個角度，慢慢想清楚。</p>
    ${ui.questionIndex(ctx, questions, { id: 'start-here' })}
    <p class="hero-alt">或者，<a href="${link(ctx, 'books/')}">先逛逛全部的書</a></p>
  </div>
</section>
${ui.questionData(ctx, questions)}

<section class="angles" id="mission" aria-labelledby="angles-title">
  <div class="wrap">
    <h2 id="angles-title">同一件事，換個角度，就不一樣了</h2>
    <p class="section-lead">「創意」對我們來說，不是點子，而是面對人生時，願意換一個角度看。</p>
    <ul class="angle-list" role="list">
      ${angles.map(a => { const b = byKey[a.book]; return `<li class="angle">
        <p class="angle-before"><span class="angle-label">原本以為</span><s>${esc(a.before)}</s></p>
        <p class="angle-after"><span class="angle-label">換個角度</span>${esc(a.after)}</p>
        <a class="angle-book" href="${ui.bookUrl(ctx, b)}">看《${esc(b.title)}》怎麼說</a>
      </li>`; }).join('')}
    </ul>
  </div>
</section>

<section class="section" id="books" aria-labelledby="featured-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="featured-title">也許，其中一本正在談你</h2>
      <a class="text-link" href="${link(ctx, 'books/')}">看全部書目</a>
    </div>
    ${ui.bookList(ctx, featured, { shelf: true })}
  </div>
</section>

<section class="section author-teaser" id="about" aria-labelledby="author-title">
  <div class="wrap author-teaser-inner">
    <img class="portrait" src="${ctx.root}images/${encodeURIComponent('陳海倫.jpg')}" alt="陳海倫" width="160" height="160" loading="lazy" decoding="async">
    <div>
      <h2 id="author-title">為什麼是陳海倫寫這些書</h2>
      <p>三十多年來，她在日本、印度、新加坡、美國與臺灣做管理顧問、婚姻與親子教育、溝通訓練。這些書裡的問題，大多來自她真的被問過的事。</p>
      <p class="fact-line">30 多部著作。英文版《世紀大媒婆》曾登上美國 Barnes &amp; Noble 六大類暢銷榜第一。曾製作並主持北美衛視《陳顧問時間》。</p>
      <a class="text-link" href="${link(ctx, 'author/helen-chen/')}">認識陳海倫</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="voices-title">
  <div class="wrap">
    <h2 id="voices-title">讀過的人這樣說</h2>
    <div class="voices">
      ${testimonials.map(t => { const b = byKey[t.book]; return `<figure class="voice"><blockquote><p>${esc(t.text)}</p></blockquote><figcaption>${esc(t.name)}，讀《<a href="${ui.bookUrl(ctx, b)}">${esc(b.title)}</a>》</figcaption></figure>`; }).join('')}
    </div>
  </div>
</section>

<section class="beyond" id="activity" aria-labelledby="beyond-title">
  <div class="wrap beyond-grid">
    <div class="beyond-club">
      <h2 id="beyond-title">一本書，讀進生活裡</h2>
      <p>書買回家，常常讀了一半就放著。品書時間是每週三晚上的線上聚會，有人陪你把書讀完、說出來、再帶回生活裡試試看。</p>
      <p class="beyond-meta">每週三 19:30–20:30，線上進行，不需要先讀完書。單場 NT$300。</p>
      <a class="btn btn-light" href="${link(ctx, 'book-club/')}" data-track="bookclub_click">了解品書時間</a>
    </div>
    <div class="beyond-editorial">
      <h2 class="h3">一本書之外</h2>
      <p>編輯讀完每一本書後，最想跟你說的一句話。</p>
      <a class="text-link" href="${link(ctx, 'editorial/')}">看編輯怎麼說</a>
    </div>
  </div>
</section>

${ui.offers(ctx)}
${ui.newsletter()}
`;
  return page(ctx, {
    path: '',
    title: '創意出版社｜有些事，短影音說不完，讓一本書慢慢告訴你',
    description: '創意出版社出版陳海倫的心靈成長、人際溝通、愛情婚姻與生活智慧書籍，包括《自己站起來》《說話的藝術》《如何愛你的父母》《陳顧問時間》。從你最近在想的事，找到一本適合你的書。',
    active: 'home',
    bodyClass: 'is-home',
    headExtra: legacyScript + '<script src="https://f.convertkit.com/ckjs/ck.5.js" defer></script>',
    schema: [{ '@type': 'WebSite', '@id': C.SITE_URL + '/#website', url: C.SITE_URL + '/', name: C.SITE_NAME, inLanguage: 'zh-TW', publisher: { '@id': C.SITE_URL + '/#publisher' } }],
  }, body);
};
