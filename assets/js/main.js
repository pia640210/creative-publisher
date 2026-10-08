/* 創意出版社：全站共用互動。沒有 JS 時，所有內容與連結仍然可以使用。 */
(function () {
  'use strict';
  var S = window.SITE || {};

  /* ---------- 追蹤：GA4 有設定才送出 ---------- */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  window.trackEvent = track;
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    track(el.dataset.track, { book: el.dataset.book, store: el.dataset.store, q: el.dataset.q, link_url: el.href });
  });
  document.addEventListener('submit', function (e) {
    if (e.target.matches('.formkit-form')) track('newsletter_submit');
  });

  /* ---------- 手機選單 ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? '選單' : '關閉';
      list.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('is-open')) { toggle.click(); toggle.focus(); }
    });
  }

  /* ---------- 你最近在想什麼？：在頁面內展開推薦 ---------- */
  var qData = document.getElementById('q-data');
  if (qData) {
    var data = JSON.parse(qData.textContent);
    document.querySelectorAll('.toc').forEach(function (toc) {
      var result = toc.querySelector('.toc-result');
      var links = toc.querySelectorAll('[data-q]');
      links.forEach(function (a) { a.setAttribute('aria-expanded', 'false'); });
      toc.addEventListener('click', function (e) {
        var a = e.target.closest('[data-q]');
        if (!a) return;
        e.preventDefault();
        var key = a.dataset.q, d = data[key];
        var wasOpen = a.getAttribute('aria-expanded') === 'true';
        links.forEach(function (l) { l.setAttribute('aria-expanded', 'false'); });
        var answer = document.getElementById('hero-answer');
        var wide = answer && toc.closest('.hero') && window.matchMedia('(min-width: 960px)').matches;
        if (wasOpen) { result.innerHTML = ''; if (wide) showVoice(); return; }
        a.setAttribute('aria-expanded', 'true');
        var html = bookCard(d);
        if (wide) { result.innerHTML = ''; answer.innerHTML = html; }
        else {
          result.innerHTML = html;
          result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }
  // 推薦書卡：第一本放大，其餘列成「也可以看看」
  function bookCard(d) {
    var main = d.books[0], rest = d.books.slice(1);
    var ext = function (b) { return b.ext ? ' target="_blank" rel="noopener"' : ''; };
    return '<div class="answer-card">' +
      '<p class="answer-q">你選了：「' + esc(d.text) + '」</p>' +
      '<div class="answer-main"><a class="answer-cover" href="' + main.url + '"' + ext(main) + ' tabindex="-1" aria-hidden="true"><span class="cover"><img src="' + main.img + '" alt="" width="300" height="400"></span></a>' +
      '<div><p class="answer-title"><a href="' + main.url + '"' + ext(main) + '>《' + esc(main.title) + '》</a></p>' +
      '<p class="answer-hook">' + esc(main.hook) + '</p>' +
      '<a class="btn btn-primary" href="' + main.url + '"' + ext(main) + ' data-track="book_click" data-book="' + esc(main.title) + '">看這本書</a></div></div>' +
      (rest.length ? '<p class="answer-more">也可以看看：' + rest.map(function (b) { return '<a href="' + b.url + '"' + ext(b) + '>《' + esc(b.title) + '》</a>'; }).join('、') + '</p>' : '') +
      '</div>';
  }
  // 預設的讀者心得：每次進站隨機一則
  var voices = []; try { voices = JSON.parse((document.getElementById('voice-data') || {}).textContent || '[]'); } catch (e) {}
  var voice = voices.length ? voices[Math.floor(Math.random() * voices.length)] : null;
  function showVoice() {
    var answer = document.getElementById('hero-answer');
    if (!answer || !voice) return;
    answer.innerHTML = '<figure class="answer-voice">' +
      '<a class="voice-cover" href="' + voice.url + '" tabindex="-1" aria-hidden="true"><span class="cover"><img src="' + voice.img + '" alt="" width="300" height="400"></span></a>' +
      '<blockquote><p>「' + esc(voice.text) + '」</p></blockquote>' +
      '<figcaption>' + esc(voice.name) + '，讀<a href="' + voice.url + '">《' + esc(voice.title) + '》</a></figcaption></figure>';
  }
  showVoice();

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  window.escHtml = esc;

  /* ---------- 營業時間提示（台北時間） ---------- */
  function isOpenNow() {
    var now = new Date();
    var ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    if ((S.HOLIDAYS || []).indexOf(ymd) > -1) return false;  // 國定假日
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(now);
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var h = Number(get('hour')) % 24 + Number(get('minute')) / 60;
    var range = (S.HOURS || {})[day];
    return !!range && h >= range[0] && h < range[1];
  }
  document.querySelectorAll('[data-hours-note]').forEach(function (n) {
    var open = isOpenNow();
    n.querySelector('[data-open]').hidden = !open;
    n.querySelector('[data-closed]').hidden = open;
  });

  /* ---------- 書籍頁：手機底部購買列 ---------- */
  var sticky = document.querySelector('[data-sticky-buy]');
  var heroCta = document.querySelector('.book-buy .cta-row, .book-buy .cta-dual');
  if (sticky && heroCta) {
    var ticking = false;
    var update = function () { sticky.classList.toggle('is-visible', heroCta.getBoundingClientRect().bottom < 0); ticking = false; };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- 表單送出：有設定 FORM_ENDPOINT 就送到 Google Apps Script；沒有就改用 Email ---------- */
  var PAGE_T = Date.now();
  // 防垃圾訊息：陷阱欄位被填（機器人才會填）就假裝成功、不送出；另附版本碼與停留時間給伺服器檢查
  function send(payload) {
    if (payload.website) return Promise.resolve({ mail: false });
    delete payload.website;
    payload._v = 'cp1'; payload._t = Date.now() - PAGE_T;
    if (!S.FORM_ENDPOINT) return Promise.resolve({ mail: true });
    return fetch(S.FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function () { return { mail: false }; });
  }
  window.sendForm = send;
  function mailto(subject, body) {
    return 'mailto:' + S.EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  window.mailtoLink = mailto;

  document.querySelectorAll('form[data-form="review"], form[data-form="contact"], form[data-form="question"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var fd = new FormData(form), payload = { type: form.dataset.form, date: new Date().toISOString(), page: location.pathname };
      fd.forEach(function (v, k) { payload[k] = String(v).trim(); });
      if (form.dataset.book) payload.book = form.dataset.book;
      status.className = 'form-status';
      status.textContent = '送出中…';
      send(payload).then(function (r) {
        var isReview = payload.type === 'review', isQ = payload.type === 'question';
        if (r.mail) {
          var subject = isQ ? '週六品書時間提問：《' + payload.book + '》' : isReview ? '讀後感：《' + payload.book + '》' : '網站訊息：' + payload.topic;
          var body = isQ ? payload.text + (payload.orderId ? '\n\n訂單編號：' + payload.orderId : '') : isReview ? payload.text + '\n\n— ' + (payload.name || '匿名讀者')
            : '稱呼：' + payload.name + '\nEmail：' + payload.email + '\n電話：' + (payload.phone || '') + '\n\n' + payload.message;
          status.innerHTML = '請按這裡，用 Email 寄出（內容已經幫你填好）：<a href="' + mailto(subject, body) + '">寄出 Email</a>';
        } else {
          status.classList.add('is-ok');
          status.textContent = isQ ? '你的問題已經投進提問箱。週六 14:00 記得回來聽解答。' : isReview ? '收到你的讀後感了，編輯審核後會刊登。謝謝你的分享！' : '訊息已經送出，我們會盡快回覆。';
          form.reset();
        }
        track(isQ ? 'question_submit' : isReview ? 'review_submit' : 'contact_submit');
      }).catch(function () {
        status.classList.add('is-error');
        status.textContent = '沒有送出成功。請檢查網路後再試一次，或寄信到 ' + S.EMAIL + '。';
      });
    });
  });

  /* ---------- 週六品書時間 ---------- */
  // 頂部公告欄：關閉後，這次瀏覽期間不再出現
  var banner = document.querySelector('[data-banner]');
  if (banner) {
    try { if (sessionStorage.getItem('cp-banner-closed')) banner.hidden = true; } catch (e) { /* ignore */ }
    banner.querySelector('[data-banner-close]').addEventListener('click', function () {
      banner.hidden = true;
      try { sessionStorage.setItem('cp-banner-closed', '1'); } catch (e) { /* ignore */ }
    });
  }
  // 倒數計時：以台北時間計算到下一個週六 14:00
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var tick = function () {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      var nowMin = day * 1440 + (Number(get('hour')) % 24) * 60 + Number(get('minute'));
      var start = Number(cd.dataset.day) * 1440 + Number(cd.dataset.start);
      var end = Number(cd.dataset.day) * 1440 + Number(cd.dataset.end);
      var label = cd.querySelector('[data-cd-label]'), time = cd.querySelector('[data-cd-time]');
      if (nowMin >= start && nowMin < end) {
        cd.classList.add('is-live'); label.textContent = '本週導讀正在進行中';
        time.textContent = '現在加入，還來得及'; return;
      }
      cd.classList.remove('is-live');
      var diff = (start - nowMin + 10080) % 10080;
      label.textContent = '距離本週六 14:00 導讀開始還有';
      time.textContent = Math.floor(diff / 1440) + ' 天 ' + Math.floor(diff % 1440 / 60) + ' 小時 ' + (diff % 60) + ' 分';
    };
    tick(); setInterval(tick, 30000);
  }
  // 每週導讀主題卡片（分頁，支援方向鍵）
  document.querySelectorAll('.week-tabs').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      track('week_card', { q: tab.textContent });
    };
    list.addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) select(t); });
    list.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus(); select(next); e.preventDefault();
    });
  });

  /* ---------- 複製按鈕 ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b || !navigator.clipboard) return;
    navigator.clipboard.writeText(b.dataset.copy).then(function () {
      var t = b.textContent; b.textContent = '已複製'; setTimeout(function () { b.textContent = t; }, 1600);
    });
  });
})();
