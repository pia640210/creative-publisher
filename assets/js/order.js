/* 線上訂購：自動計算最划算的組合 */
(function () {
  'use strict';
  var S = window.SITE || {};
  var O = S.OFFERS || { three: 1000, six: 1700 };
  var SHIP = (S.SHIPPING || {}).upTo4 || 70;
  var fmt = function (n) { return 'NT$' + n.toLocaleString('zh-TW'); };

  /* 計價：在所有組合方式中找最便宜的。組合優先放較貴的書，剩下的按原價。 */
  function price(items) {
    var best = { total: Infinity };
    [false].forEach(function () {
      var pool = items.slice(), base = 0, parts = [];
      pool.sort(function (a, b) { return b.price - a.price; });
      var n = pool.length;
      for (var k6 = 0; k6 * 6 <= n; k6++) {
        for (var k3 = 0; k6 * 6 + k3 * 3 <= n; k3++) {
          var m = k6 * 6 + k3 * 3;
          var rest = pool.slice(m).reduce(function (s, i) { return s + i.price; }, 0);
          var total = base + k6 * O.six + k3 * O.three + rest;
          if (total < best.total) {
            var p = parts.slice();
            if (k6) p.push('買五送一 ×' + k6);
            if (k3) p.push('任選 3 本 ×' + k3);
            if (n - m) p.push((n - m) + ' 本原價');
            best = { total: total, parts: p };
          }
        }
      }
    });
    if (!items.length) best = { total: 0, parts: [] };
    best.list = items.reduce(function (s, i) { return s + i.price; }, 0);
    return best;
  }
  window.orderPrice = price; // 方便測試

  function nudge(items, current) {
    var n = items.length;
    if (!n) return '';
    var plusOne = price(items.concat([{ key: '_x', price: 380 }]));
    if (plusOne.total <= current.total) return '再選 1 本，總價反而更便宜：現在 ' + fmt(current.total) + '，' + (n + 1) + ' 本只要 ' + fmt(plusOne.total) + '。';
    if (n < 3) return '再選 ' + (3 - n) + ' 本，3 本只要 ' + fmt(O.three) + '。';
    if (n === 4) return '再選 2 本，買五送一，6 本只要 ' + fmt(O.six) + '。';
    return '';
  }

  /* ---------- 訂購頁 ---------- */
  var form = document.getElementById('order-form');
  if (form) {
    var boxes = Array.prototype.slice.call(form.querySelectorAll('input[name="book"]'));
    var $ = function (sel) { return document.querySelector(sel); };
    var selected = function () { return boxes.filter(function (b) { return b.checked; }).map(function (b) { return { key: b.value, title: b.dataset.title, price: Number(b.dataset.price) }; }); };

    function shipping(n) { return n === 0 ? null : (n <= 4 ? SHIP : 'later'); }
    function render() {
      var items = selected(), p = price(items), n = items.length, ship = shipping(n);
      $('[data-sum-items]').innerHTML = n ? items.map(function (i) { return '<li><span>' + window.escHtml(i.title) + '</span><span>' + fmt(i.price) + '</span></li>'; }).join('') : '<li class="muted">還沒有選書</li>';
      $('[data-sum-books]').innerHTML = n ? (p.total < p.list ? '<s class="muted">' + fmt(p.list) + '</s> ' : '') + fmt(p.total) + (p.parts.length ? '<br><span class="form-note">' + p.parts.join('＋') + '</span>' : '') : fmt(0);
      $('[data-sum-ship]').textContent = ship === null ? '—' : (ship === 'later' ? '5 本以上，由專人另行通知' : fmt(ship));
      var total = p.total + (typeof ship === 'number' ? ship : 0);
      $('[data-sum-total]').textContent = fmt(total) + (ship === 'later' ? '＋運費' : '');
      $('[data-nudge]').textContent = nudge(items, p);
      var bar = document.querySelector('[data-order-bar]');
      if (bar) { bar.querySelector('[data-bar-count]').textContent = n + ' 本'; bar.querySelector('[data-bar-total]').textContent = fmt(total); bar.classList.toggle('is-visible', n > 0); }
      return { items: items, pricing: p, shipping: ship, total: total };
    }

    // 從書籍頁帶入：/order/?add=ziji 或 ?add=art1,art2,art3
    var add = new URLSearchParams(location.search).get('add');
    if (add) add.split(',').forEach(function (k) { var b = boxes.find(function (x) { return x.value === k; }); if (b) b.checked = true; });
    form.addEventListener('change', render);
    form.querySelectorAll('[data-add-set]').forEach(function (btn) {
      btn.addEventListener('click', function () { btn.dataset.addSet.split(',').forEach(function (k) { var b = boxes.find(function (x) { return x.value === k; }); if (b) b.checked = true; }); render(); });
    });
    render();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var state = render(), status = form.querySelector('.form-status');
      status.className = 'form-status';
      if (!state.items.length) { status.classList.add('is-error'); status.textContent = '請先勾選至少一本書。'; boxes[0].focus(); return; }
      if (!form.reportValidity()) return;
      var fd = new FormData(form);
      if (fd.get('website')) { location.href = (S.ROOT || '../') + 'order/thank-you/'; return; }  // 機器人
      var order = {
        type: 'order', id: 'W' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(),
        name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'), address: fd.get('address'),
        last5: fd.get('last5') || '', callback: fd.get('callback') === 'yes', note: fd.get('note') || '',
        items: state.items.map(function (i) { return i.title; }), itemKeys: state.items.map(function (i) { return i.key; }),
        bookTotal: state.pricing.total, listTotal: state.pricing.list, combo: state.pricing.parts.join('＋'),
        shipping: state.shipping === 'later' ? '另行通知' : state.shipping, total: state.total,
      };
      var btn = form.querySelector('[data-submit]'); btn.disabled = true; status.textContent = '送出中…';
      window.sendForm(order).then(function (r) {
        try { sessionStorage.setItem('cp-order', JSON.stringify(order)); } catch (err) { /* 無痕模式 */ }
        window.trackEvent('purchase_request', { value: order.total, currency: 'TWD', items: order.items.length });
        location.href = (S.ROOT || '../') + 'order/thank-you/' + (r.mail ? '?mail=1' : '');
      }).catch(function () {
        btn.disabled = false; status.classList.add('is-error');
        status.textContent = '沒有送出成功。請檢查網路後再試一次，或來電 ' + S.PHONE + '。';
      });
    });
  }

  /* ---------- 感謝頁 ---------- */
  var recap = document.querySelector('[data-order-recap]');
  if (recap) {
    var order = null;
    try { order = JSON.parse(sessionStorage.getItem('cp-order')); } catch (err) { /* ignore */ }
    if (order) {
      var text = orderText(order);
      var vip = document.querySelector('[data-vip]');
      if (vip && (order.itemKeys || []).indexOf('zhuiai') > -1) { vip.hidden = false; vip.querySelector('[data-vip-id]').textContent = order.id; }
      recap.innerHTML = '<pre class="order-text" style="white-space:pre-wrap;font:inherit;margin:0">' + window.escHtml(text) + '</pre>';
      if (new URLSearchParams(location.search).get('mail')) {
        document.querySelector('[data-thanks-title]').textContent = '訂單內容已經準備好了';
        var step = document.querySelector('[data-mail-step]'); step.hidden = false;
        step.querySelector('[data-mailto]').href = window.mailtoLink('網站訂單 ' + order.id + '｜' + order.name, text);
        step.querySelector('[data-copy-order]').dataset.copy = text;
        var bn = document.querySelector('[data-bank-note]'); if (bn) bn.textContent = '匯款後，回信告訴我們帳號末五碼就可以，不用再來電。';
      }
    }
  }
  function orderText(o) {
    return [
      '訂單編號：' + o.id,
      '書籍：' + o.items.join('、'),
      '書款：' + fmt(o.bookTotal) + (o.combo ? '（' + o.combo + '）' : ''),
      '運費：' + (typeof o.shipping === 'number' ? fmt(o.shipping) : o.shipping),
      '合計：' + fmt(o.total) + (o.shipping === '另行通知' ? '＋運費' : ''),
      '收件人：' + o.name, '電話：' + o.phone, 'Email：' + o.email, '地址：' + o.address,
      o.last5 ? '匯款末五碼：' + o.last5 : '', o.callback ? '希望專人來電確認' : '', o.note ? '備註：' + o.note : '',
    ].filter(Boolean).join('\n');
  }
})();
