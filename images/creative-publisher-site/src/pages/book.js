const C = require('../config');
const { esc, link, absImg, abs, page } = require('../components/layout');
const ui = require('../components/ui');
const { byKey } = require('../data/books');
const { topics } = require('../data/taxonomy');

function reviewForm(b) {
  return `<form class="review-form" data-form="review" data-book="${esc(b.title)}">
  <h3 class="h4">分享你的讀後感</h3>
  <p class="form-note">送出後由編輯審核，刊登時只顯示你填的稱呼。</p>
  <label for="rv-text">這本書對你的影響或感受</label>
  <textarea id="rv-text" name="text" rows="4" required></textarea>
  <label for="rv-name">稱呼（選填，例如：王小姐，台北）</label>
  <input id="rv-name" name="name" autocomplete="nickname">
  <button class="btn btn-quiet" type="submit">送出讀後感</button>
  <p class="form-status" role="status"></p>
</form>`;
}

function volumeSection(ctx, v) {
  return `<section class="volume" id="${v.orderKey}" aria-labelledby="${v.orderKey}-t">
  ${ui.cover(ctx, { title: v.shortTitle }, { img: v.img, size: 's' })}
  <div>
    <h3 id="${v.orderKey}-t">${esc(v.title.replace('｜', '：'))}</h3>
    <p>${esc(v.desc)}</p>
    ${v.editor.length ? `<ul class="plain-list">${v.editor.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
    <p class="volume-actions"><a class="btn btn-quiet" href="${link(ctx, 'order/')}?add=${v.orderKey}" data-track="add_to_order" data-book="${v.orderKey}">選這一冊</a></p>
    ${ui.buyLinks(v.links, 'store-links-inline')}
  </div>
</section>`;
}

module.exports = function bookPage(ctx, b) {
  const topic = topics.find(t => t.slug === b.topic);
  const path = `books/${b.slug}/`;
  const orderHref = `${link(ctx, 'order/')}?add=${b.isSeries ? b.volumes.map(v => v.orderKey).join(',') : b.key}`;
  const orderLabel = b.isSeries ? `我想讀這一套（${b.volumesLabel}）` : '我想讀這一本';
  const related = topic.books.filter(k => k !== b.key).slice(0, 4);
  const edition = b.edition ? byKey[b.edition.relatedKey] : null;
  const allLinks = b.isSeries ? [] : b.links;

  const body = `
<article class="book-page wrap book-layout">
  <div class="book-hero-cover">${ui.cover(ctx, b, { size: 'l', eager: true })}</div>
  <div class="book-main">
  <header class="book-hero">
    <div class="book-hero-text">
      <p class="book-topic"><a href="${link(ctx, `topics/${topic.slug}/`)}">${esc(topic.name)}</a></p>
      <h1 class="book-h1">${esc(b.title)}${b.isSeries ? `<span class="vol">${b.volumesLabel}</span>` : ''}</h1>
      <p class="book-byline">陳海倫 著</p>
      <p class="book-lead">${esc(b.hook)}</p>
      ${edition ? `<p class="edition-note">${esc(b.edition.label)}。<a href="${ui.bookUrl(ctx, edition)}">看《${esc(edition.title)}》</a></p>` : ''}
      <div class="book-buy">
        <p class="price">${b.isSeries ? `每冊 NT$${b.price}${b.key === 'art' ? `，套書 NT$${C.OFFERS.artSet.toLocaleString()}` : ''}` : `定價 NT$${b.price}`}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${orderHref}" data-track="add_to_order" data-book="${b.key}">${orderLabel}</a>
          <a class="btn btn-quiet" href="#about-book">先看看這本書在談什麼</a>
        </div>
        <p class="offer-inline">向出版社訂購：任選 3 本 NT$${C.OFFERS.three.toLocaleString()}，買五送一 NT$${C.OFFERS.six.toLocaleString()}</p>
        ${allLinks.length ? `<div class="store-block"><p class="store-label">也可以在網路書店購買</p>${ui.buyLinks(allLinks)}</div>` : ''}
      </div>
    </div>
  </header>

  <div class="book-body">
    <section class="fit" aria-labelledby="fit-t">
      <h2 id="fit-t">這本書適合你，如果……</h2>
      <ul class="fit-list">${b.fitIf.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    </section>

    <section id="about-book" aria-labelledby="about-t">
      <h2 id="about-t">這本書在談什麼</h2>
      <p class="prose">${esc(b.desc)}</p>
      ${b.award ? `<p class="award">${esc(b.award)}</p>` : ''}
      ${b.quote ? `<blockquote class="pull"><p>「${esc(b.quote.text)}」</p><cite>${esc(b.quote.cite)}</cite></blockquote>` : ''}
    </section>

    <section aria-labelledby="take-t">
      <h2 id="take-t">讀完，你可能會帶走</h2>
      <ul class="plain-list">${b.takeaway.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>

    ${b.isSeries ? `<section aria-labelledby="vol-t"><h2 id="vol-t">各冊介紹</h2>${b.volumes.map(v => volumeSection(ctx, v)).join('')}</section>` : ''}

    ${!b.isSeries && b.editor.length ? `<section aria-labelledby="ed-t">
      <h2 id="ed-t">編輯想跟你說</h2>
      <ul class="plain-list editor-notes">${b.editor.map(e => `<li>${esc(e)}</li>`).join('')}</ul>
    </section>` : ''}

    <section aria-labelledby="rv-t">
      <h2 id="rv-t">讀者的話</h2>
      ${b.reviews.length ? ui.reviewList(b.reviews) : '<p class="muted">這本書還沒有刊登的讀者心得，歡迎成為第一個分享的人。</p>'}
      ${reviewForm(b)}
    </section>

    ${b.site ? `<p class="more-site">這本書另有一個專屬介紹頁，內容更完整：<a href="${esc(b.site)}" target="_blank" rel="noopener" data-track="outbound_promo">看《${esc(b.title)}》專屬頁</a></p>` : ''}

    <aside class="author-card" aria-label="作者">
      <img class="portrait portrait-s" src="${ctx.root}images/${encodeURIComponent('陳海倫.jpg')}" alt="" width="72" height="72" loading="lazy">
      <div><p class="author-card-name">陳海倫</p><p>國際管理顧問、演講者、暢銷作家。三十多年來，她在不同國家陪許多人處理工作、關係與人生的問題，這些書裡的問題，大多是她真的被問過的事。</p><a class="text-link" href="${link(ctx, 'author/helen-chen/')}">認識陳海倫</a></div>
    </aside>
  </div>
  </div>
</article>

<section class="section related" aria-labelledby="rel-t">
  <div class="wrap">
    <h2 id="rel-t">同樣在談「${esc(topic.name)}」的書</h2>
    ${ui.bookList(ctx, related)}
  </div>
</section>

<div class="sticky-buy" data-sticky-buy>
  <span class="sticky-title">${esc(b.title)}</span>
  <a class="btn btn-primary" href="${orderHref}" data-track="add_to_order" data-book="${b.key}">${b.isSeries ? '選這一套' : '我想讀這一本'}</a>
</div>`;

  const bookSchema = b.isSeries
    ? { '@type': 'BookSeries', name: b.title, url: abs(path), image: absImg(b.img), author: { '@id': C.SITE_URL + '/author/helen-chen/#person' }, publisher: { '@id': C.SITE_URL + '/#publisher' }, inLanguage: 'zh-TW', description: b.desc,
        hasPart: b.volumes.map(v => ({ '@type': 'Book', name: v.shortTitle, image: absImg(v.img), inLanguage: 'zh-TW', offers: { '@type': 'Offer', price: String(v.price), priceCurrency: 'TWD', availability: 'https://schema.org/InStock', url: abs(path) + '#' + v.orderKey } })) }
    : { '@type': 'Book', name: b.title, url: abs(path), image: absImg(b.img), author: { '@id': C.SITE_URL + '/author/helen-chen/#person' }, publisher: { '@id': C.SITE_URL + '/#publisher' }, inLanguage: 'zh-TW', description: b.desc,
        offers: { '@type': 'Offer', price: String(b.price), priceCurrency: 'TWD', availability: 'https://schema.org/InStock', url: abs(path) } };

  return page(ctx, {
    path,
    title: `《${b.title}》陳海倫著｜${b.hook.replace(/[？?。]$/, '')}｜創意出版社`,
    description: `${b.hook}《${b.title}》${b.desc}`.slice(0, 150),
    ogImage: b.img, ogType: 'book',
    preloadImg: b.img,
    active: 'books',
    bodyClass: 'has-sticky',
    crumbs: [['首頁', ''], [topic.name, `topics/${topic.slug}/`], [b.title, path]],
    schema: [bookSchema, { '@type': 'Person', '@id': C.SITE_URL + '/author/helen-chen/#person', name: '陳海倫', url: abs('author/helen-chen/') }],
  }, body);
};
