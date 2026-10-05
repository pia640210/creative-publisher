const C = require('../config');
const { esc, link, abs, page } = require('../components/layout');
const ui = require('../components/ui');
const { byKey, books } = require('../data/books');
const { topics } = require('../data/taxonomy');

const portrait = (ctx, cls = '') => `<img class="portrait ${cls}" src="${ctx.root}images/${encodeURIComponent('陳海倫.jpg')}" alt="陳海倫" width="200" height="200" loading="lazy" decoding="async">`;

function author(ctx) {
  const body = `
<header class="wrap author-hero">
  ${portrait(ctx, 'portrait-l')}
  <div>
    <h1>陳海倫</h1>
    <p class="author-role">國際管理顧問、演講者、暢銷作家，心橋顧問公司總裁</p>
    <blockquote class="pull"><p>「技巧只是表達心意的技術，凌駕其上的則是真誠的意念與生命力。」</p><cite>《說話的藝術3》自序</cite></blockquote>
  </div>
</header>

<div class="wrap narrow prose-block">
  <section aria-labelledby="why-t">
    <h2 id="why-t">她為什麼一直寫這些事</h2>
    <p>三十多年來，陳海倫長年投入品格教育、企業管理、婚姻與親子教育、溝通訓練與情緒管理，足跡遍及日本、印度、新加坡、美國與臺灣，陪許多個人、家庭與企業，在工作、關係與人生的不同階段找方向。</p>
    <p>對她來說，寫作不只是傳遞觀念，而是一種陪伴與實踐。她最在意的，不只是讓人理解一個道理，而是真正找到自己的力量，在現實生活裡一步一步走出屬於自己的改變。</p>
    <p class="todo">[待補資料：她在顧問工作中一再看到的問題、開始寫書的原因——建議以訪談或各書自序整理]</p>
  </section>

  <section aria-labelledby="books-t">
    <h2 id="books-t">所以，她寫了這些書</h2>
    ${topics.map(t => `<div class="author-topic"><h3 class="h4"><a href="${link(ctx, `topics/${t.slug}/`)}">${esc(t.name)}</a></h3><p>${t.books.map(k => `<a href="${ui.bookUrl(ctx, byKey[k])}">《${esc(byKey[k].title)}》</a>`).join('、')}</p></div>`).join('')}
  </section>

  <section aria-labelledby="start-t">
    <h2 id="start-t">第一次讀她的書，可以從這裡開始</h2>
    ${ui.bookList(ctx, ['chen', 'zuoji', 'art'])}
  </section>

  <details class="record">
    <summary>經歷與紀錄</summary>
    <ul class="plain-list">
      <li>超過三十年跨國經營與顧問經驗。</li>
      <li>30 多部著作。</li>
      <li>接受亞洲、美洲、歐洲媒體專訪超過 200 次。</li>
      <li>英文版《世紀大媒婆》（The Matchmaker of the Century）2012 年於美國 Barnes &amp; Noble 榮登婚姻、心靈成長、愛與羅曼史、人際關係、自我幫助、父母家庭等六大類暢銷書第一名。</li>
      <li>作媒故事被記錄於得獎紀錄片《尋情歷險記》，於多個國際影展放映。</li>
      <li>曾製作並主持北美衛視《陳顧問時間》。</li>
      <li>專業領域：品格教育、情緒管理、生活管理、企業經營、溝通與行銷、演講。</li>
    </ul>
  </details>
</div>`;
  return page(ctx, {
    path: 'author/helen-chen/', title: '陳海倫｜國際管理顧問、暢銷作家｜創意出版社',
    description: '陳海倫，國際管理顧問、演講者、暢銷作家，著有《說話的藝術》《陳顧問時間》《自己站起來》《如何愛你的父母》等 30 多部作品。英文版《世紀大媒婆》曾登美國 Barnes & Noble 暢銷榜第一。',
    ogImage: 'images/陳海倫.jpg', ogType: 'profile', active: 'author',
    crumbs: [['首頁', ''], ['作者陳海倫', 'author/helen-chen/']],
    schema: [{ '@type': 'Person', '@id': C.SITE_URL + '/author/helen-chen/#person', name: '陳海倫', alternateName: 'Hellen Chen', jobTitle: '國際管理顧問、暢銷作家', url: abs('author/helen-chen/'),
      knowsAbout: ['品格教育', '情緒管理', '溝通', '婚姻與親子教育', '企業管理'] }],
  }, body);
}

// 一本書之外：目前用既有的「編輯推薦」，一書一則，連回書籍頁。不虛構文章。
function editorial(ctx) {
  const notes = books.map(b => ({ b, note: b.editor && b.editor[0] ? b.editor[0] : (b.volumes ? b.volumes[0].editor[0] : null) })).filter(x => x.note);
  const body = `
<header class="wrap page-head">
  <h1>一本書之外</h1>
  <p class="section-lead">編輯讀完每一本書，最想先跟你說的那句話。</p>
</header>
<div class="wrap narrow">
  <ul class="notes" role="list">
    ${notes.map(({ b, note }) => `<li class="note"><p>${esc(note)}</p><a class="text-link" href="${ui.bookUrl(ctx, b)}">《${esc(b.title)}》</a></li>`).join('')}
  </ul>
  <p class="muted">更多閱讀觀點、品書時間的對話紀錄，會陸續放在這裡。想第一時間收到，可以訂閱下方的電子報。</p>
</div>
${ui.newsletter()}`;
  return page(ctx, {
    path: 'editorial/', title: '一本書之外｜編輯想跟你說｜創意出版社', description: '創意出版社編輯讀完每一本書後的閱讀觀點：自己站起來、做自己、說話的藝術、如何愛你的父母等。',
    active: 'editorial', crumbs: [['首頁', ''], ['一本書之外', 'editorial/']],
    headExtra: '<script src="https://f.convertkit.com/ckjs/ck.5.js" defer></script>',
  }, body);
}

function bookClub(ctx) {
  const body = `
<header class="wrap page-head">
  <h1>品書時間</h1>
  <p class="section-lead">有人陪你，把一本書真正讀進生活裡。</p>
</header>
<div class="wrap narrow prose-block">
  <section aria-labelledby="flow-t">
    <h2 id="flow-t">一本書，怎麼變成生活的一部分</h2>
    <ol class="flow" >
      <li><strong>讀</strong>每週一個段落，不用一個人硬撐著讀完。</li>
      <li><strong>說</strong>把讀到的說出來，也聽聽別人怎麼想。</li>
      <li><strong>換個角度</strong>同一段文字，每個人讀出的東西都不一樣。</li>
      <li><strong>帶回生活</strong>試試看，下週再回來聊。</li>
    </ol>
  </section>
  <section aria-labelledby="who-t">
    <h2 id="who-t">也許適合你，如果……</h2>
    <ul class="fit-list">
      <li>你相信閱讀有好處，卻很難養成習慣，需要一點持續下去的力量。</li>
      <li>工作很忙，覺得視野越來越窄，想重新找回方向。</li>
      <li>你想認識一些不為了利益往來、可以好好聊天的朋友。</li>
      <li>你想練習把話說清楚，需要一個安全的地方開口。</li>
    </ul>
  </section>
  <section class="club-box" aria-labelledby="info-t">
    <h2 id="info-t" class="h3">時間與費用</h2>
    <p>每週三晚上 19:30–20:30，線上進行，不需要先讀完書。</p>
    <ul class="price-list">
      <li><span>單場</span><strong>NT$300</strong></li>
      <li><span>十場組合（共 12 場，多送兩場）</span><strong>NT$3,000</strong></li>
    </ul>
    <div class="cta-row">
      <a class="btn btn-primary" href="${C.BOOK_CLUB_URL}" target="_blank" rel="noopener" data-track="bookclub_signup">報名品書時間</a>
      <a class="btn btn-quiet" href="tel:${C.PHONE_TEL}" data-track="tel_click">來電詢問 ${C.PHONE}</a>
    </div>
    ${ui.hoursNote(ctx)}
    <p class="todo">[待補資料：品書時間讀過的書單]</p>
  </section>
</div>`;
  return page(ctx, {
    path: 'book-club/', title: '心橋精選品書時間｜每週三線上讀書會｜創意出版社', description: '每週三晚上 19:30–20:30 線上進行，有人陪你把一本書讀進生活裡。不需要先讀完書，單場 NT$300。',
    active: 'book-club', crumbs: [['首頁', ''], ['品書時間', 'book-club/']],
    schema: [{ '@type': 'Event', name: '心橋精選品書時間', description: '每週三晚上的線上讀書會', eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode', organizer: { '@id': C.SITE_URL + '/#publisher' },
      eventSchedule: { '@type': 'Schedule', byDay: 'https://schema.org/Wednesday', startTime: '19:30', endTime: '20:30', repeatFrequency: 'P1W', scheduleTimezone: 'Asia/Taipei' },
      offers: { '@type': 'Offer', price: '300', priceCurrency: 'TWD', url: C.BOOK_CLUB_URL }, location: { '@type': 'VirtualLocation', url: C.BOOK_CLUB_URL } }],
  }, body);
}

function about(ctx) {
  const body = `
<header class="wrap page-head">
  <h1>關於創意</h1>
  <p class="section-lead">有些事，值得慢下來。人生的事，短影音說不完，讓一本書慢慢告訴你。</p>
</header>
<div class="wrap narrow prose-block">
  <section aria-labelledby="what-t">
    <h2 id="what-t">「創意」是什麼意思</h2>
    <p>不是廣告點子，也不是設計。我們說的創意，是遇到問題時，願意換一個角度：換個角度看自己、看父母、看伴侶、看失敗、看人生。</p>
    <p>原本以為只有一個答案，讀完一本書，發現原來還可以這樣想。這就是我們想出版的書。</p>
  </section>
  <section aria-labelledby="believe-t">
    <h2 id="believe-t">我們出版的書，有三個共同點</h2>
    <dl class="beliefs">
      <dt>以心為本</dt><dd>溝通不只是技巧，而是用心、用情、用生命去傳遞溫暖。</dd>
      <dt>實戰好用</dt><dd>透過 Q&amp;A 和生活化的比喻，讀完就能用在日常裡。</dd>
      <dt>從個人到社會</dt><dd>每個人的關係變好了，社會也會更和諧。</dd>
    </dl>
    <p>出版主軸：心靈成長、人際溝通、生活實踐、生命智慧。宗旨：創意有心，讀者開心。</p>
  </section>
  <section aria-labelledby="story-t">
    <h2 id="story-t">出版社的故事</h2>
    <p class="todo">[待補資料：成立年份、重要書籍與改版里程碑]</p>
    <p>創意出版社出版陳海倫的著作，與心橋顧問公司長期合作，把顧問工作裡累積的經驗整理成書。<a href="https://hellenchentruegroup.com/" target="_blank" rel="noopener">心橋顧問公司網站</a></p>
  </section>
  <section aria-labelledby="work-t">
    <h2 id="work-t">合作洽詢</h2>
    <p>媒體採訪、書店經銷、團體或企業採購、演講邀約，歡迎來信或填寫 <a href="${link(ctx, 'contact/')}">聯絡表單</a>。</p>
    <p><a href="mailto:${C.EMAIL}" data-track="email_click">${C.EMAIL}</a>，或來電 <a href="tel:${C.PHONE_TEL}" data-track="tel_click">${C.PHONE}</a></p>
  </section>
</div>`;
  return page(ctx, {
    path: 'about/', title: '關於創意出版社｜創意有心，讀者開心', description: '創意出版社相信有些事值得慢下來。我們出版陳海倫關於心靈成長、人際溝通、生活實踐與生命智慧的書。',
    active: 'about', crumbs: [['首頁', ''], ['關於創意', 'about/']],
  }, body);
}

function contact(ctx) {
  const body = `
<header class="wrap page-head">
  <h1>聯絡我們</h1>
  <p class="section-lead">來電、寫信或親自拜訪都可以。</p>
</header>
<div class="wrap contact-grid">
  <section aria-labelledby="ci-t">
    <h2 id="ci-t" class="h3">聯絡資訊</h2>
    <dl class="info-list">
      <dt>電話</dt><dd><a href="tel:${C.PHONE_TEL}" data-track="tel_click">${C.PHONE}</a></dd>
      <dt>來電時間</dt><dd>${C.HOURS_TEXT.join('<br>')}</dd>
      <dt>Email</dt><dd><a href="mailto:${C.EMAIL}" data-track="email_click">${C.EMAIL}</a><br><span class="muted">隨時收件，週末也可以寄</span></dd>
      <dt>地址</dt><dd>${C.ADDRESS}<br><span class="muted">${C.ADDRESS_NOTE}</span></dd>
      <dt>傳真</dt><dd>${C.FAX}</dd>
    </dl>
    ${ui.hoursNote(ctx)}
    <iframe class="map" src="https://maps.google.com/maps?q=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%BE%A9%E8%88%88%E5%8C%97%E8%B7%AF178%E8%99%9F&z=16&hl=zh-TW&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="創意出版社地圖：台北市復興北路178號2樓"></iframe>
  </section>
  <section aria-labelledby="cf-t">
    <h2 id="cf-t" class="h3">寫訊息給我們</h2>
    <form class="stack-form" data-form="contact">
      <label for="c-topic">想聊的事</label>
      <select id="c-topic" name="topic">
        <option>購書問題</option><option>分享讀後感</option><option>品書時間</option><option>團體或企業採購</option><option>媒體採訪、經銷、演講邀約</option><option>其他</option>
      </select>
      <label for="c-name">你的稱呼</label>
      <input id="c-name" name="name" autocomplete="name" required>
      <label for="c-email">Email</label>
      <input id="c-email" name="email" type="email" autocomplete="email" required>
      <label for="c-phone">電話（選填）</label>
      <input id="c-phone" name="phone" type="tel" autocomplete="tel">
      <label for="c-msg">內容</label>
      <textarea id="c-msg" name="message" rows="5" required></textarea>
      <button class="btn btn-primary" type="submit">送出訊息</button>
      <p class="form-status" role="status"></p>
    </form>
  </section>
</div>`;
  return page(ctx, {
    path: 'contact/', title: '聯絡我們｜創意出版社', description: `創意出版社電話 ${C.PHONE}（週二至週四 09:00–17:00，週一、週五 13:00–17:00），Email ${C.EMAIL}，地址${C.ADDRESS}，${C.ADDRESS_NOTE}。`,
    active: 'contact', crumbs: [['首頁', ''], ['聯絡我們', 'contact/']],
  }, body);
}

module.exports = { author, editorial, bookClub, about, contact };
