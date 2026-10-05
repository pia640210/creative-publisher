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
        if (wasOpen) { result.innerHTML = ''; return; }
        a.setAttribute('aria-expanded', 'true');
        result.innerHTML = '<h3>也許，這幾本書能陪你想一想</h3><ul class="rec-list">' + d.books.map(function (b) {
          return '<li><a href="' + b.url + '"><span class="cover cover-xs" style="width:64px"><img src="' + b.img + '" alt="" width="64" height="85" loading="lazy"></span><span><strong>' + esc(b.title) + '</strong><span class="rec-hook">' + esc(b.hook) + '</span></span></a></li>';
        }).join('') + '</ul>';
        // 手機上把結果捲進畫面
        if (window.matchMedia('(max-width: 959px)').matches) result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  window.escHtml = esc;

  /* ---------- 營業時間提示（台北時間） ---------- */
  function isOpenNow() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var h = Number(get('hour')) % 24 + Number(get('minute')) / 60;
    var range = (S.HOURS || {})[day];
    return !!range && h >= range[0] && h < range[1];
    // 國定假日無法自動判斷，仍會顯示「營業中」
  }
  document.querySelectorAll('[data-hours-note]').forEach(function (n) {
    var open = isOpenNow();
    n.querySelector('[data-open]').hidden = !open;
    n.querySelector('[data-closed]').hidden = open;
  });

  /* ---------- 書籍頁：手機底部購買列 ---------- */
  var sticky = document.querySelector('[data-sticky-buy]');
  var heroCta = document.querySelector('.book-buy .cta-row');
  if (sticky && heroCta) {
    var ticking = false;
    var update = function () { sticky.classList.toggle('is-visible', heroCta.getBoundingClientRect().bottom < 0); ticking = false; };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- 表單送出：有設定 FORM_ENDPOINT 就送到 Google Apps Script；沒有就改用 Email ---------- */
  function send(payload) {
    if (!S.FORM_ENDPOINT) return Promise.resolve({ mail: true });
    return fetch(S.FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function () { return { mail: false }; });
  }
  window.sendForm = send;
  function mailto(subject, body) {
    return 'mailto:' + S.EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  window.mailtoLink = mailto;

  document.querySelectorAll('form[data-form="review"], form[data-form="contact"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var fd = new FormData(form), payload = { type: form.dataset.form, date: new Date().toISOString(), page: location.pathname };
      fd.forEach(function (v, k) { payload[k] = String(v).trim(); });
      if (form.dataset.book) payload.book = form.dataset.book;
      status.className = 'form-status';
      status.textContent = '送出中…';
      send(payload).then(function (r) {
        var isReview = payload.type === 'review';
        if (r.mail) {
          var subject = isReview ? '讀後感：《' + payload.book + '》' : '網站訊息：' + payload.topic;
          var body = isReview ? payload.text + '\n\n— ' + (payload.name || '匿名讀者')
            : '稱呼：' + payload.name + '\nEmail：' + payload.email + '\n電話：' + (payload.phone || '') + '\n\n' + payload.message;
          status.innerHTML = '請按這裡，用 Email 寄出（內容已經幫你填好）：<a href="' + mailto(subject, body) + '">寄出 Email</a>';
        } else {
          status.classList.add('is-ok');
          status.textContent = isReview ? '收到你的讀後感了，編輯審核後會刊登。謝謝你的分享！' : '訊息已經送出，我們會盡快回覆。';
          form.reset();
        }
        track(isReview ? 'review_submit' : 'contact_submit');
      }).catch(function () {
        status.classList.add('is-error');
        status.textContent = '沒有送出成功。請檢查網路後再試一次，或寄信到 ' + S.EMAIL + '。';
      });
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
