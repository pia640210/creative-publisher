/* 讀者心得：顯示「已在試算表打勾刊登」的心得，並送出新的讀後感
   可以放在任何書頁，不依賴其他程式。 */
(function () {
  'use strict';
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxk4QP9hdjztKkFeCckc923b9QIYagXWWJ8spREGABYONRXWpbygn2WQc6fpiuPR2Ex/exec';
  var css = '.lr-wrap{margin:24px 0 8px}.lr-h{font-size:18px;font-weight:700;margin:0 0 12px;letter-spacing:.04em}' +
    '.lr-list{display:grid;gap:12px;margin:0;padding:0;list-style:none}@media(min-width:760px){.lr-list{grid-template-columns:1fr 1fr}}' +
    '.lr-card{margin:0;padding:18px 20px;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:10px;color:#2A2622;text-align:left}' +
    '.lr-card p{margin:0;font-size:16px;line-height:1.85;white-space:pre-line}.lr-by{margin-top:10px!important;font-size:14px!important;color:#6b5d54}' +
    '.lr-new{display:inline-block;margin-left:6px;padding:0 6px;border-radius:4px;background:#B4513A;color:#fff;font-size:12px;vertical-align:1px}' +
    '.lr-sec{padding:40px 20px}.lr-sec-in{max-width:860px;margin:0 auto}' +
    '.lr-share{margin-top:16px;border:1px solid rgba(0,0,0,.12);border-radius:10px;background:#fff;color:#2A2622}' +
    '.lr-share summary{cursor:pointer;padding:14px 18px;font-weight:700;min-height:44px;list-style-position:inside}' +
    '.lr-form{display:grid;gap:8px;padding:0 18px 18px;text-align:left}.lr-form label{font-size:15px;font-weight:700;margin-top:6px}' +
    '.lr-form textarea,.lr-form input{font:inherit;font-size:16px;padding:10px 12px;border:1px solid rgba(0,0,0,.25);border-radius:8px;background:#fff;color:#2A2622;width:100%;box-sizing:border-box}' +
    '.lr-form button{justify-self:start;min-height:44px;padding:0 22px;border:0;border-radius:999px;background:#B4513A;color:#fff;font:inherit;font-weight:700;cursor:pointer}' +
    '.lr-note{font-size:13px;color:#6b5d54;margin:0}.lr-status{min-height:1.4em;font-size:14px;margin:0}.lr-hp{position:absolute;left:-9999px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // 1) 顯示已刊登的心得
  document.querySelectorAll('[data-live-reviews]').forEach(function (box) {
    var url = ENDPOINT + '?action=reviews&slug=' + encodeURIComponent(box.dataset.slug || '') + '&book=' + encodeURIComponent(box.dataset.book || '');
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      var list = (d && d.reviews) || []; if (!list.length) return;
      var h = document.createElement('p'); h.className = 'lr-h'; h.textContent = '最新讀者心得';
      var ul = document.createElement('ul'); ul.className = 'lr-list';
      var now = Date.now();
      list.forEach(function (rv) {
        var li = document.createElement('li'); li.className = 'lr-card';
        var p = document.createElement('p'); p.textContent = rv.text;
        var by = document.createElement('p'); by.className = 'lr-by'; by.textContent = '— ' + (rv.name || '讀者');
        if (rv.date && now - new Date(rv.date).getTime() < 30 * 864e5) { var n = document.createElement('span'); n.className = 'lr-new'; n.textContent = '新'; by.appendChild(n); }
        li.appendChild(p); li.appendChild(by); ul.appendChild(li);
      });
      box.appendChild(h); box.appendChild(ul); box.hidden = false;
    }).catch(function () { /* 讀不到就不顯示，不影響頁面 */ });
  });

  // 2) 送出新的讀後感（只處理 .lr-form；一般書頁的表單由 main.js 處理）
  document.querySelectorAll('form.lr-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.lr-status'), fd = new FormData(form);
      if (String(fd.get('website') || '')) return;   // 機器人
      var text = String(fd.get('text') || '').trim(); if (!text) { status.textContent = '請先寫下你的讀後感。'; return; }
      var payload = { type: 'review', date: new Date().toISOString(), page: location.pathname, book: form.dataset.book, name: String(fd.get('name') || '').trim(), text: text };
      status.textContent = '送出中…';
      fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
        .then(function () { status.textContent = '謝謝你！讀後感已送出，編輯審核後就會刊登。'; form.reset(); if (window.gtag) gtag('event', 'review_submit'); })
        .catch(function () { status.textContent = '送出失敗，請稍後再試，或寄信到 createbook.press@gmail.com。'; });
    });
  });
})();
