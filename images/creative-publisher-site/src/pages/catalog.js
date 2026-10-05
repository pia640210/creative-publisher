const C = require('../config');
const { esc, link, abs, page } = require('../components/layout');
const ui = require('../components/ui');
const { byKey, books } = require('../data/books');
const { topics, questions } = require('../data/taxonomy');

// /books/ 找一本書：先問問題，再看完整書目（依主題分段，不用 JS 也能瀏覽）
function booksIndex(ctx) {
  const body = `
<header class="wrap page-head">
  <h1>找一本書</h1>
  <p class="section-lead">不知道從哪一本開始也沒關係。先從你最近在想的事情開始。</p>
</header>
<div class="wrap">${ui.questionIndex(ctx, questions, { id: 'finder', heading: '你最近在想什麼？' })}</div>
${ui.questionData(ctx, questions)}

<section class="section" aria-labelledby="all-t">
  <div class="wrap">
    <h2 id="all-t">全部書目</h2>
    <nav class="topic-jump" aria-label="依主題跳轉"><ul>${topics.map(t => `<li><a href="#t-${t.slug}">${esc(t.name)}</a></li>`).join('')}</ul></nav>
    ${topics.map(t => `<section class="topic-block" id="t-${t.slug}" aria-labelledby="t-${t.slug}-h">
      <div class="section-head"><h3 id="t-${t.slug}-h" class="h2">${esc(t.name)}</h3><a class="text-link" href="${link(ctx, `topics/${t.slug}/`)}">這個主題怎麼讀</a></div>
      ${ui.bookList(ctx, t.books, { headingLevel: 4 })}
    </section>`).join('')}
  </div>
</section>

<section class="section q-static" aria-labelledby="qs-t">
  <div class="wrap">
    <h2 id="qs-t" class="h3">依問題找書</h2>
    ${questions.map(q => `<section id="q-${q.key}" class="q-block"><h3 class="h4">${esc(q.text)}</h3>${ui.bookList(ctx, q.books, { headingLevel: 4 })}</section>`).join('')}
  </div>
</section>
${ui.offers(ctx, { compact: true })}`;
  return page(ctx, {
    path: 'books/', title: '找一本書｜陳海倫全部著作書目｜創意出版社',
    description: '依你最近在想的事情找書：認識自己、夢想與人生方向、好好與人相處、愛情與婚姻、生活的智慧。創意出版社陳海倫全部著作一次看。',
    active: 'books', crumbs: [['首頁', ''], ['找一本書', 'books/']],
    schema: [{ '@type': 'CollectionPage', name: '找一本書', url: abs('books/'), hasPart: books.map(b => ({ '@type': b.isSeries ? 'BookSeries' : 'Book', name: b.title, url: abs(`books/${b.slug}/`) })) }],
  }, body);
}

function topicsIndex(ctx) {
  const body = `
<header class="wrap page-head">
  <h1>主題閱讀</h1>
  <p class="section-lead">每一個主題，都從一句你可能也說過的話開始。</p>
</header>
<div class="wrap topic-index">
  ${topics.map(t => `<a class="topic-row" href="${link(ctx, `topics/${t.slug}/`)}">
    <span class="topic-voice">「${esc(t.voice)}」</span>
    <span class="topic-name">${esc(t.name)}<span class="topic-count">${t.books.length} 本</span></span>
  </a>`).join('')}
</div>`;
  return page(ctx, {
    path: 'topics/', title: '主題閱讀｜創意出版社', description: '認識自己、夢想與人生方向、好好與人相處、愛情與婚姻、生活的智慧——從五個主題，找到陪你走一段路的書。',
    active: 'topics', crumbs: [['首頁', ''], ['主題閱讀', 'topics/']],
  }, body);
}

function topicPage(ctx, t) {
  const start = byKey[t.start];
  const rest = t.books.filter(k => k !== t.start);
  const reviews = t.books.flatMap(k => (byKey[k].reviews || []).map(r => ({ ...r, vol: r.vol || byKey[k].title }))).slice(0, 3);
  const body = `
<header class="wrap page-head topic-head">
  <p class="topic-voice-lg">「${esc(t.voice)}」</p>
  <h1>${esc(t.name)}</h1>
  <p class="section-lead">${esc(t.intro)}</p>
</header>

<section class="section start-here" aria-labelledby="start-t">
  <div class="wrap start-grid">
    ${ui.cover(ctx, start, { size: 'l' })}
    <div>
      <h2 id="start-t" class="h3">如果只讀一本，從這本開始</h2>
      <p class="start-title"><a href="${ui.bookUrl(ctx, start)}">《${esc(start.title)}》</a></p>
      <p class="book-lead">${esc(start.hook)}</p>
      <ul class="plain-list">${start.fitIf.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <a class="btn btn-primary" href="${ui.bookUrl(ctx, start)}">看這本書</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="more-t">
  <div class="wrap">
    ${t.stages
      ? `<h2 id="more-t">先找到你現在在哪一站</h2>${t.stages.map(s => `<section class="stage" aria-labelledby="st-${s.key}"><h3 id="st-${s.key}" class="h4">${esc(s.name)}</h3>${ui.bookList(ctx, s.books, { headingLevel: 4 })}</section>`).join('')}`
      : `<h2 id="more-t">這個主題的其他書</h2>${ui.bookList(ctx, rest)}`}
  </div>
</section>

${reviews.length ? `<section class="section" aria-labelledby="tv-t"><div class="wrap"><h2 id="tv-t">讀過的人這樣說</h2>${ui.reviewList(reviews)}</div></section>` : ''}
${ui.offers(ctx, { compact: true })}`;
  return page(ctx, {
    path: `topics/${t.slug}/`, title: `${t.name}｜${t.voice.replace(/。$/, '')}｜創意出版社`,
    description: `${t.voice}${t.intro}`.slice(0, 150),
    ogImage: start.img, active: 'topics',
    crumbs: [['首頁', ''], ['主題閱讀', 'topics/'], [t.name, `topics/${t.slug}/`]],
    schema: [{ '@type': 'CollectionPage', name: t.name, url: abs(`topics/${t.slug}/`), description: t.intro,
      mainEntity: { '@type': 'ItemList', itemListElement: t.books.map((k, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`books/${byKey[k].slug}/`), name: byKey[k].title })) } }],
  }, body);
}

module.exports = { booksIndex, topicsIndex, topicPage };
