/**
 * 創意出版社：網站表單收件程式（Google Apps Script）
 * 接收三種表單：訂購單（order）、讀後感（review）、聯絡訊息（contact）
 * 1. 寫進 Google 試算表（每種表單一個工作表）
 * 2. 寄 Email 通知出版社
 * 3. 訂購單會再寄一封確認信（含匯款資訊）給讀者
 *
 * 部署步驟（用 createbook.press@gmail.com 登入）：
 *  a. 到 https://sheets.new 建立試算表，命名「網站表單」
 *  b. 選單「擴充功能 → Apps Script」，把這個檔案的內容整個貼上，儲存
 *  c. 右上「部署 → 新增部署作業」，類型選「網頁應用程式」
 *     執行身分：我　／　誰可以存取：所有人
 *  d. 複製產生的網址，貼到網站 src/config.js 的 FORM_ENDPOINT，重新建置
 */
const NOTIFY_TO = 'createbook.press@gmail.com';
const BANK = '玉山銀行長春分行（代號 808）\n戶名：創意出版社有限公司\n帳號：0406-940-003763';
const HEADERS = {
  order: ['時間', '訂單編號', '姓名', '電話', 'Email', '地址', '書籍', '組合', '書款', '運費', '合計', '末五碼', '希望來電', '備註', '處理狀態'],
  review: ['時間', '書名', '稱呼', '讀後感', '頁面', '是否刊登'],
  contact: ['時間', '主題', '稱呼', 'Email', '電話', '內容'],
};

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const type = HEADERS[d.type] ? d.type : 'contact';
  const sheet = getSheet_(type);
  const now = new Date();
  if (type === 'order') {
    sheet.appendRow([now, d.id, d.name, d.phone, d.email, d.address, (d.items || []).join('、'), d.combo, d.bookTotal, d.shipping, d.total, d.last5, d.callback ? '是' : '', d.note, '新訂單']);
    const summary = orderSummary_(d);
    MailApp.sendEmail({ to: NOTIFY_TO, subject: '【新訂單】' + d.id + '｜' + d.name + '｜NT$' + d.total, body: summary, replyTo: d.email });
    if (d.email) {
      MailApp.sendEmail({
        to: d.email, replyTo: NOTIFY_TO, name: '創意出版社',
        subject: '創意出版社：我們收到你的訂單了（' + d.id + '）',
        body: d.name + ' 你好：\n\n謝謝你的訂購，以下是你的訂單內容：\n\n' + summary +
          '\n\n【匯款資訊】\n' + BANK +
          '\n\n匯款後，直接回覆這封信告訴我們帳號末五碼就可以了。' +
          (d.shipping === '另行通知' ? '\n5 本以上的運費，我們會另外跟你聯絡。' : '') +
          '\n\n有任何問題，歡迎回信，或來電 (02) 8712-2800（週二至週四 09:00–17:00，週一、週五 13:00–17:00）。\n\n創意出版社',
      });
    }
  } else if (type === 'review') {
    sheet.appendRow([now, d.book, d.name || '匿名讀者', d.text, d.page, '待審核']);
    MailApp.sendEmail(NOTIFY_TO, '【讀後感】《' + d.book + '》', (d.name || '匿名讀者') + '：\n\n' + d.text);
  } else {
    sheet.appendRow([now, d.topic, d.name, d.email, d.phone, d.message]);
    MailApp.sendEmail({ to: NOTIFY_TO, subject: '【網站訊息】' + d.topic + '｜' + d.name, body: d.message + '\n\n' + d.name + '\n' + d.email + '\n' + (d.phone || ''), replyTo: d.email });
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_(type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const name = { order: '訂單', review: '讀後感', contact: '聯絡訊息' }[type];
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(HEADERS[type]); sh.setFrozenRows(1); }
  return sh;
}

function orderSummary_(d) {
  return ['訂單編號：' + d.id, '書籍：' + (d.items || []).join('、'), '書款：NT$' + d.bookTotal + (d.combo ? '（' + d.combo + '）' : ''),
    '運費：' + (typeof d.shipping === 'number' ? 'NT$' + d.shipping : d.shipping), '合計：NT$' + d.total,
    '收件人：' + d.name, '電話：' + d.phone, 'Email：' + d.email, '地址：' + d.address,
    d.last5 ? '匯款末五碼：' + d.last5 : '', d.callback ? '希望專人來電確認' : '', d.note ? '備註：' + d.note : ''].filter(String).join('\n');
}
