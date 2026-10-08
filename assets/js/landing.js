/* 書籍頁互動模組：抽卡、測驗、夢想檢測、築夢宣言卡 */
(function () {
  'use strict';
  var track = window.trackEvent || function () {};
  var esc = window.escHtml || function (s) { return String(s); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 抽卡／翻牌：每次抽到和上一次不同的 ---------- */
  document.querySelectorAll('[data-draw]').forEach(function (box) {
    var items = JSON.parse(box.querySelector('[data-draw-items]').textContent);
    var card = box.querySelector('.draw-card'), front = box.querySelector('.draw-front'), back = box.querySelector('.draw-back');
    var btn = box.querySelector('[data-draw-btn]'), last = -1;
    btn.addEventListener('click', function () {
      var i; do { i = Math.floor(Math.random() * items.length); } while (items.length > 1 && i === last); last = i;
      var it = items[i];
      var show = function () {
        back.querySelector('[data-draw-t]').textContent = it.t ? it.t : '';
        back.querySelector('[data-draw-t]').hidden = !it.t;
        back.querySelector('[data-draw-d]').textContent = it.t ? it.d : '「' + it.d + '」';
        front.hidden = true; back.hidden = false;
      };
      if (reduce) show(); else { card.classList.remove('is-flip'); void card.offsetWidth; card.classList.add('is-flip'); setTimeout(show, 220); }
      btn.textContent = btn.dataset.again;
      track('draw_card', { q: box.id });
    });
  });

  /* ---------- 選擇題：點選後展開陳海倫的剖析 ---------- */
  document.querySelectorAll('[data-quiz]').forEach(function (q) {
    var opts = q.querySelectorAll('.quiz-opt'), ans = q.querySelector('[data-quiz-answer]');
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        opts.forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
        q.querySelector('[data-quiz-lead]').textContent = o.dataset.lead;
        ans.hidden = false;
        track('quiz_answer', { q: q.querySelector('legend').textContent });
      });
    });
  });

  /* ---------- 關係健檢（離婚黑皮書）：兩題作答後給出閱讀建議 ---------- */
  document.querySelectorAll('[data-health]').forEach(function (box) {
    var res = JSON.parse(box.querySelector('[data-health-results]').textContent);
    var out = box.querySelector('[data-health-result]'), picks = {};
    box.querySelectorAll('fieldset').forEach(function (fs, qi) {
      fs.querySelectorAll('.quiz-opt').forEach(function (o) {
        o.addEventListener('click', function () {
          fs.querySelectorAll('.quiz-opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
          picks[qi] = Number(o.dataset.v);
          if (Object.keys(picks).length === box.querySelectorAll('fieldset').length) {
            var low = Object.keys(picks).some(function (k) { return picks[k] === 0; });
            var r = low ? res.low : res.high;
            out.innerHTML = '<p class="dc-title">' + esc(r.title) + '</p><p>' + esc(r.d) + '</p>';
            out.hidden = false; track('quiz_result', { q: low ? 'low' : 'high' });
          }
        });
      });
    });
  });

  /* ---------- 夢想 vs 妄想 ---------- */
  document.querySelectorAll('[data-dreamcheck]').forEach(function (box) {
    var res = JSON.parse(box.querySelector('[data-dc-results]').textContent);
    var out = box.querySelector('[data-dc-result]'), input = box.querySelector('.dc-input'), picks = {};
    var sets = box.querySelectorAll('[data-dc-q]');
    sets.forEach(function (fs) {
      fs.querySelectorAll('.quiz-opt').forEach(function (o) {
        o.addEventListener('click', function () {
          fs.querySelectorAll('.quiz-opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
          picks[fs.dataset.dcQ] = o.dataset.v === '1';
          if (Object.keys(picks).length < sets.length) return;
          // 優先順序：沒有行動 → 沒有平衡 → 不是自己想要的 → 全部通過
          var key = !picks.action ? 'action' : !picks.balance ? 'balance' : !picks.self ? 'self' : 'good';
          var r = res[key], dream = (input.value || '').trim();
          out.innerHTML = (dream ? '<p class="dc-dream">你的夢想：' + esc(dream) + '</p>' : '') +
            '<p class="dc-title">' + esc(r.title) + '</p><blockquote class="dc-quote">「' + esc(r.quote) + '」</blockquote><p>' + esc(r.tip) + '</p>';
          out.hidden = false; track('quiz_result', { q: key });
        });
      });
    });
  });

  /* ---------- 築夢宣言卡：在裝置上用 canvas 產生圖片 ---------- */
  document.querySelectorAll('[data-prompts]').forEach(function (box) {
    var make = box.querySelector('[data-pc-make]'), out = box.querySelector('[data-pc-out]');
    var img = out.querySelector('img'), dl = out.querySelector('[data-pc-dl]'), share = out.querySelector('[data-pc-share]');
    var book = box.dataset.book, file = null;
    function wrap(ctx, text, maxW) {
      var lines = [], line = '';
      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        if (ch === '\n') { lines.push(line); line = ''; continue; }
        if (ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; } else line += ch;
      }
      if (line) lines.push(line);
      return lines;
    }
    make.addEventListener('click', function () {
      var q = (box.querySelector('input[type=radio]:checked') || {}).value || '';
      var a = box.querySelector('.pc-answer').value.trim();
      if (!a) { box.querySelector('.pc-answer').focus(); return; }
      var draw = function () {
        var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
        var g = c.getContext('2d');
        g.fillStyle = '#FBF8F2'; g.fillRect(0, 0, W, H);
        g.strokeStyle = '#BA7517'; g.lineWidth = 4; g.strokeRect(60, 60, W - 120, H - 120);
        g.fillStyle = '#8A5410'; g.font = '500 34px "Noto Serif TC", serif'; g.fillText('我的築夢宣言', 120, 180);
        g.fillStyle = '#5E574E'; g.font = '30px "Noto Serif TC", serif';
        var y = 260; wrap(g, q, W - 240).forEach(function (l) { g.fillText(l, 120, y); y += 46; });
        g.strokeStyle = '#E3DACB'; g.lineWidth = 2; g.beginPath(); g.moveTo(120, y + 10); g.lineTo(W - 120, y + 10); g.stroke();
        g.fillStyle = '#2A2622'; g.font = '700 52px "Noto Serif TC", serif';
        y += 110; wrap(g, a, W - 240).slice(0, 9).forEach(function (l) { g.fillText(l, 120, y); y += 78; });
        g.fillStyle = '#5E574E'; g.font = '28px "Noto Serif TC", serif';
        g.fillText('—— 寫給正在築夢的自己', 120, H - 210);
        g.fillStyle = '#8A5410'; g.font = '26px "Noto Serif TC", serif';
        g.fillText('《' + book + '》陳海倫｜創意出版社', 120, H - 130);
        var url = c.toDataURL('image/png'); img.src = url; dl.href = url; out.hidden = false;
        c.toBlob(function (blob) {
          file = blob ? new File([blob], '我的築夢宣言卡.png', { type: 'image/png' }) : null;
          share.hidden = !(file && navigator.canShare && navigator.canShare({ files: [file] }));
        });
        track('dream_card', { q: q });
      };
      if (document.fonts && document.fonts.load) document.fonts.load('700 52px "Noto Serif TC"').then(draw, draw); else draw();
    });
    share.addEventListener('click', function () {
      if (file && navigator.share) navigator.share({ files: [file], title: '我的築夢宣言' }).catch(function () {});
    });
  });

  /* ---------- 輪播金句：6 秒換一句，可手動切換；滑鼠停留時暫停 ---------- */
  document.querySelectorAll('[data-rotate]').forEach(function (box) {
    var qs = box.querySelectorAll('.rot-q'), dots = box.querySelectorAll('.rot-dots button'), i = 0, timer = null, paused = false;
    var go = function (n) { i = n; qs.forEach(function (q, k) { q.hidden = k !== i; }); dots.forEach(function (d, k) { d.setAttribute('aria-pressed', String(k === i)); }); };
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    box.addEventListener('mouseenter', function () { paused = true; }); box.addEventListener('mouseleave', function () { paused = false; });
    if (!reduce) timer = setInterval(function () { if (!paused && !document.hidden) go((i + 1) % qs.length); }, 6000);
  });

  /* ---------- 幸福預定日：選年月，倒數到那個月的 1 號 ---------- */
  document.querySelectorAll('[data-countdown-wed]').forEach(function (box) {
    var y = box.querySelector('[data-cd-y]'), m = box.querySelector('[data-cd-m]'), out = box.querySelector('[data-cd-out]'), num = box.querySelector('[data-cd-num]'), timer;
    var now = new Date(); m.value = String(now.getMonth() + 1);
    box.querySelector('[data-cd-go]').addEventListener('click', function () {
      var target = new Date(Number(y.value), Number(m.value) - 1, 1);
      var tick = function () {
        var ms = target - new Date();
        if (ms <= 0) { num.textContent = '就是現在！'; return; }
        var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), mi = Math.floor(ms % 36e5 / 6e4);
        num.textContent = d + ' 天 ' + h + ' 小時 ' + mi + ' 分';
      };
      clearInterval(timer); tick(); timer = setInterval(tick, 30000); out.hidden = false;
      track('wedding_date', { q: y.value + '-' + m.value });
    });
  });

  /* ---------- 類型測驗：全部作答後，取最多的類型（同票時以最後一題為準） ---------- */
  document.querySelectorAll('[data-typequiz]').forEach(function (box) {
    var res = JSON.parse(box.querySelector('[data-tq-results]').textContent), out = box.querySelector('[data-tq-result]');
    var sets = box.querySelectorAll('fieldset'), picks = {};
    sets.forEach(function (fs, qi) {
      fs.querySelectorAll('.quiz-opt').forEach(function (o) {
        o.addEventListener('click', function () {
          fs.querySelectorAll('.quiz-opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); });
          picks[qi] = o.dataset.v;
          if (Object.keys(picks).length < sets.length) return;
          var count = {}, best = null, bestN = 0;
          Object.keys(picks).forEach(function (k) { var v = picks[k]; if (v) count[v] = (count[v] || 0) + 1; });
          var lastV = picks[sets.length - 1];
          Object.keys(count).forEach(function (v) { if (count[v] > bestN || (count[v] === bestN && v === lastV)) { best = v; bestN = count[v]; } });
          var r = res[best] || res[lastV] || res[Object.keys(res)[0]];
          out.innerHTML = '<p class="dc-title">' + esc(r.title) + '</p><p>' + esc(r.d) + '</p><p class="tq-fix"><strong>書中的心法：</strong>' + esc(r.fix) + '</p>';
          out.hidden = false; track('quiz_result', { q: best });
        });
      });
    });
  });

  /* ---------- 翻面卡片 ---------- */
  document.querySelectorAll('.flip').forEach(function (f) {
    f.addEventListener('click', function () {
      var on = f.getAttribute('aria-pressed') !== 'true';
      var swap = function () { f.setAttribute('aria-pressed', String(on)); f.querySelector('.flip-front').hidden = on; f.querySelector('.flip-back').hidden = !on; };
      if (reduce) swap(); else { f.classList.remove('is-flip'); void f.offsetWidth; f.classList.add('is-flip'); setTimeout(swap, 200); }
      if (on) track('flip_card', { q: f.querySelector('.flip-front .flip-text').textContent });
    });
  });

  /* ---------- 結婚檢查表 ---------- */
  document.querySelectorAll('[data-checklist]').forEach(function (box) {
    var fields = box.querySelectorAll('[data-ck]'), out = box.querySelector('[data-ck-out]'), list = box.querySelector('[data-ck-list]'), text = '';
    fields.forEach(function (f) {
      f.querySelectorAll('.quiz-opt').forEach(function (o) {
        o.addEventListener('click', function () { f.querySelectorAll('.quiz-opt').forEach(function (x) { x.setAttribute('aria-pressed', String(x === o)); }); });
      });
    });
    box.querySelector('[data-ck-make]').addEventListener('click', function () {
      var rows = [];
      fields.forEach(function (f) {
        var on = f.querySelector('.quiz-opt[aria-pressed="true"]'), inp = f.querySelector('input');
        var v = on ? on.textContent : (inp ? inp.value.trim() : '');
        rows.push([f.dataset.label.replace(/（.*?）/, ''), v || '還沒想好']);
      });
      list.innerHTML = rows.map(function (r) { return '<li><span>' + esc(r[0]) + '</span><strong>' + esc(r[1]) + '</strong></li>'; }).join('');
      text = '我的結婚檢查表\n' + rows.map(function (r) { return '・' + r[0] + '：' + r[1]; }).join('\n');
      out.hidden = false; track('checklist_made');
    });
    box.querySelector('[data-ck-copy]').addEventListener('click', function (e) {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { e.target.textContent = '已複製'; setTimeout(function () { e.target.textContent = '複製檢查表'; }, 1600); });
    });
  });

  /* ---------- 心裡的石頭：捲動時慢慢融化成光 ---------- */
  document.querySelectorAll('[data-stones]').forEach(function (box) {
    if (reduce) { box.style.setProperty('--p', 1); return; }
    var update = function () {
      var r = box.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.2)));
      box.style.setProperty('--p', p.toFixed(3));
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true }); update();
  });

  /* ---------- 寫給爸媽的明信片 ---------- */
  document.querySelectorAll('[data-letter]').forEach(function (box) {
    var ta = box.querySelector('.lt-text'), out = box.querySelector('[data-lt-out]'), img = out.querySelector('img');
    var dl = out.querySelector('[data-lt-dl]'), share = out.querySelector('[data-lt-share]'), file = null;
    box.querySelectorAll('.lt-starter').forEach(function (b) {
      b.addEventListener('click', function () { ta.value = b.textContent.replace(/……$/, '') + (ta.value ? '\n' + ta.value : ''); ta.focus(); });
    });
    box.querySelector('[data-lt-make]').addEventListener('click', function () {
      var t = ta.value.trim(); if (!t) { ta.focus(); return; }
      var to = box.querySelector('[data-lt-to]').value;
      makeCard({ head: '寫給' + to, sub: '', body: t, sign: '—— 一直愛著你們的孩子', foot: '《' + box.dataset.book + '》陳海倫｜創意出版社', bg: '#FDF7EE' }, function (url, f) {
        img.src = url; dl.href = url; out.hidden = false; file = f;
        share.hidden = !(file && navigator.canShare && navigator.canShare({ files: [file] }));
      });
      track('letter_card');
    });
    share.addEventListener('click', function () { if (file && navigator.share) navigator.share({ files: [file], title: '寫給爸媽的信' }).catch(function () {}); });
  });

  /* 共用：在裝置上畫一張直式圖卡 */
  function makeCard(o, done) {
    var draw = function () {
      var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
      var g = c.getContext('2d');
      var wrapT = function (text, maxW) { var lines = [], line = ''; for (var i = 0; i < text.length; i++) { var ch = text[i]; if (ch === '\n') { lines.push(line); line = ''; continue; } if (g.measureText(line + ch).width > maxW) { lines.push(line); line = ch; } else line += ch; } if (line) lines.push(line); return lines; };
      g.fillStyle = o.bg || '#FBF8F2'; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#BA7517'; g.lineWidth = 4; g.strokeRect(60, 60, W - 120, H - 120);
      g.fillStyle = '#8A5410'; g.font = '500 40px "Noto Serif TC", serif'; g.fillText(o.head, 120, 190);
      g.fillStyle = '#2A2622'; g.font = '44px "Noto Serif TC", serif';
      var y = 300; wrapT(o.body, W - 240).slice(0, 13).forEach(function (l) { g.fillText(l, 120, y); y += 70; });
      g.fillStyle = '#5E574E'; g.font = '30px "Noto Serif TC", serif'; g.fillText(o.sign, 120, H - 210);
      g.fillStyle = '#8A5410'; g.font = '26px "Noto Serif TC", serif'; g.fillText(o.foot, 120, H - 130);
      var url = c.toDataURL('image/png');
      c.toBlob(function (blob) { done(url, blob ? new File([blob], 'card.png', { type: 'image/png' }) : null); });
    };
    if (document.fonts && document.fonts.load) document.fonts.load('44px "Noto Serif TC"').then(draw, draw); else draw();
  }
})();
