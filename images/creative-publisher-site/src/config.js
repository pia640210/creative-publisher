// 全站設定：要改電話、營業時間、表單網址、GA，都只改這一個檔案
module.exports = {
  SITE_URL: 'https://books.hellenchentruegroup.com',
  SITE_NAME: '創意出版社',
  PHONE: '(02) 8712-2800',
  PHONE_TEL: '0287122800',
  PHONE_INTL: '+886-2-8712-2800',
  FAX: '(02) 8712-2808',
  EMAIL: 'createbook.press@gmail.com',
  ADDRESS: '台北市復興北路 178 號 2 樓',
  ADDRESS_NOTE: '捷運南京復興站步行約 5 分鐘',
  // 0=週日 … 6=週六；[開始, 結束]（24 小時制）
  HOURS: { 1: [13, 17], 2: [9, 17], 3: [9, 17], 4: [9, 17], 5: [13, 17] },
  HOURS_TEXT: ['週二至週四 09:00–17:00', '週一、週五 13:00–17:00', '週末及國定假日公休'],
  BANK: { name: '玉山銀行長春分行', code: '808', holder: '創意出版社有限公司', account: '0406-940-003763' },
  // 優惠方案（計價邏輯在 assets/js/order.js，會自動套用最划算的組合）
  OFFERS: { three: 1000, six: 1700, artSet: 1100 },
  SHIPPING: { upTo4: 70 },
  // Google Apps Script 部署後的網址（見 gas/Code.gs）。留空時，表單會改用 Email 寄出，不會壞掉。
  FORM_ENDPOINT: '',
  // GA4 評估 ID，例如 'G-XXXXXXX'。留空時不載入任何追蹤程式。
  GA_ID: '',
  BOOK_CLUB_URL: 'https://hellenchentruegroup.com/optin/heartbridge-book-club/',
  DEFAULT_OG_IMAGE: 'images/自己站起來.png',
};
