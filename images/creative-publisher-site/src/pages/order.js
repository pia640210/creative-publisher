const C = require('../config');
const { esc, link, asset, page } = require('../components/layout');
const ui = require('../components/ui');
const { orderItems } = require('../data/books');

function order(ctx) {
  const body = `
<header class="wrap page-head">
  <h1>線上訂購</h1>
  <p class="section-lead">勾選想讀的書，我們會自動幫你套用最划算的組合。送出後會收到確認信和匯款資訊。</p>
</header>

<form class="wrap order-grid" id="order-form" data-form="order" action="mailto:${C.EMAIL}" method="post" enctype="text/plain">
  <div class="order-main">
    <fieldset class="pick">
      <legend class="h3">選書</legend>
      <p class="form-note">任選 3 本 NT$${C.OFFERS.three.toLocaleString()}；任選 6 本（買五送一）NT$${C.OFFERS.six.toLocaleString()}。<button type="button" class="link-btn" data-add-set="art1,art2,art3">一次選《說話的藝術》全 3 冊</button></p>
      <ul class="pick-list" role="list">
        ${orderItems.map(it => `<li><label class="pick-item">
          <input type="checkbox" name="book" value="${it.key}" data-price="${it.price}" data-title="${esc(it.title)}">
          <span class="cover cover-xs"><img src="${asset(ctx, it.img)}" alt="" width="60" height="80" loading="lazy" decoding="async"></span>
          <span class="pick-text"><span class="pick-title">${esc(it.title)}</span><span class="pick-price">NT$${it.price}</span></span>
        </label></li>`).join('')}
      </ul>
    </fieldset>

    <fieldset class="stack-form">
      <legend class="h3">寄送資料</legend>
      <label for="o-name">收件人姓名</label>
      <input id="o-name" name="name" autocomplete="name" required>
      <label for="o-phone">手機或電話</label>
      <input id="o-phone" name="phone" type="tel" autocomplete="tel" required>
      <label for="o-email">Email（確認信會寄到這裡）</label>
      <input id="o-email" name="email" type="email" autocomplete="email" required>
      <label for="o-address">寄送地址</label>
      <input id="o-address" name="address" autocomplete="street-address" required>
      <label for="o-last5">匯款帳號末五碼（選填，匯款後回覆確認信告訴我們也可以）</label>
      <input id="o-last5" name="last5" inputmode="numeric" pattern="[0-9]{5}" maxlength="5">
      <label class="check"><input type="checkbox" name="callback" value="yes"> 我希望專人來電確認訂單</label>
      <label for="o-note">備註（選填）</label>
      <textarea id="o-note" name="note" rows="3"></textarea>
    </fieldset>
  </div>

  <aside class="order-summary" aria-labelledby="sum-t">
    <h2 id="sum-t" class="h3">訂單小計</h2>
    <ul class="sum-items" data-sum-items><li class="muted">還沒有選書</li></ul>
    <dl class="sum-lines">
      <dt>書款</dt><dd data-sum-books>NT$0</dd>
      <dt>運費</dt><dd data-sum-ship>—</dd>
      <dt class="sum-total">合計</dt><dd class="sum-total" data-sum-total>NT$0</dd>
    </dl>
    <p class="nudge" data-nudge aria-live="polite"></p>
    <p class="form-note">付款方式：銀行轉帳。匯款資訊會在送出後顯示，並寄到你的信箱。</p>
    <button class="btn btn-primary btn-block" type="submit" data-submit>送出訂單</button>
    <p class="form-status" role="status"></p>
    <p class="form-note">也可以來電訂購 <a href="tel:${C.PHONE_TEL}" data-track="tel_click">${C.PHONE}</a></p>
    ${ui.hoursNote(ctx)}
  </aside>
</form>

<div class="sticky-buy order-bar" data-order-bar>
  <span><span data-bar-count>0 本</span>　<strong data-bar-total>NT$0</strong></span>
  <a class="btn btn-primary" href="#o-name">填寫寄送資料</a>
</div>`;
  return page(ctx, {
    path: 'order/', title: '線上訂購｜任選 3 本 NT$1,000，買五送一｜創意出版社',
    description: '向創意出版社直接訂購陳海倫著作：任選 3 本 NT$1,000、買五送一 NT$1,700、說話的藝術套書 NT$1,100。訂購單自動計算最划算的組合。',
    active: 'order', bodyClass: 'has-sticky', crumbs: [['首頁', ''], ['線上訂購', 'order/']],
    scripts: ['assets/js/order.js'],
  }, body);
}

function thankYou(ctx) {
  const b = C.BANK;
  const body = `
<div class="wrap narrow thanks">
  <h1 data-thanks-title>謝謝你，訂單已經送出</h1>
  <div class="mail-step" data-mail-step hidden>
    <p><strong>還差一步：</strong>請按下方按鈕，用 Email 把訂單寄給我們（內容已經幫你填好）。</p>
    <p class="cta-row"><a class="btn btn-primary" data-mailto href="mailto:${C.EMAIL}">用 Email 寄出訂單</a><button class="btn btn-quiet" type="button" data-copy-order>複製訂單內容</button></p>
    <p class="form-note">如果沒有跳出寄信畫面，可以複製內容後寄到 ${C.EMAIL}，或來電 ${C.PHONE}。</p>
  </div>
  <section aria-labelledby="ty-order"><h2 id="ty-order" class="h3">你的訂單</h2><div data-order-recap><p class="muted">找不到訂單內容。如果你剛剛送出了訂單，請查看確認信。</p></div></section>
  <section class="bank" aria-labelledby="ty-bank">
    <h2 id="ty-bank" class="h3">匯款資訊</h2>
    <dl class="info-list">
      <dt>銀行</dt><dd>${b.name}（代號 ${b.code}）</dd>
      <dt>戶名</dt><dd>${b.holder}</dd>
      <dt>帳號</dt><dd><span data-account>${b.account}</span> <button class="link-btn" type="button" data-copy="${b.account.replace(/-/g, '')}">複製帳號</button></dd>
    </dl>
    <p class="form-note" data-bank-note>匯款後，回覆確認信告訴我們帳號末五碼就可以，不用再來電。</p>
  </section>
  <section class="club-invite" aria-labelledby="ty-club">
    <h2 id="ty-club" class="h3">書寄到之前，要不要先來一次品書時間？</h2>
    <p>每週三晚上 19:30–20:30，線上進行，不需要先讀完書。單場 NT$300。</p>
    <a class="btn btn-quiet" href="${link(ctx, 'book-club/')}" data-track="bookclub_click">了解品書時間</a>
  </section>
</div>`;
  return page(ctx, {
    path: 'order/thank-you/', title: '訂單已送出｜創意出版社', description: '謝謝你的訂購。', noindex: true,
    active: 'order', scripts: ['assets/js/order.js'],
  }, body);
}

function notFound(ctx) {
  const body = `<div class="wrap narrow page-head"><h1>這一頁找不到了</h1><p class="section-lead">也許網址打錯了，或這一頁已經搬家。可以從這裡重新開始：</p><p class="cta-row"><a class="btn btn-primary" href="${link(ctx, '')}">回首頁</a><a class="btn btn-quiet" href="${link(ctx, 'books/')}">找一本書</a></p></div>`;
  return page(ctx, { path: '404.html', title: '找不到這一頁｜創意出版社', description: '找不到這一頁。', noindex: true }, body);
}

// 舊網址相容：purchase.html、contact.html 自動轉到新頁面
function legacyRedirect(target, label) {
  return `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"><title>${label}｜創意出版社</title>
<link rel="canonical" href="${C.SITE_URL}/${target}"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}"></head>
<body><p>這一頁已經搬到 <a href="${target}">${label}</a>。</p></body></html>`;
}

module.exports = { order, thankYou, notFound, legacyRedirect };
