# 創意出版社官網（2026 改版）

靜態網站產生器，不需要安裝任何套件，只需要 Node.js 18 以上。

## 快速開始

```bash
# 1. 把原本網站的 images/ 資料夾整個放到專案根目錄（檔名不用改）
# 2. 建置
node build.js
# 3. 本機預覽（需要網路下載 serve）
npx serve dist
```

建置結果在 `dist/`，整個資料夾上傳到主機（或 GitHub Pages）即可。

## 專案結構

```
src/
  config.js            全站設定：電話、營業時間、Email、匯款、優惠、表單網址、GA
  data/
    books.js           書籍資料（單一資料來源）＋讀者導向欄位
    taxonomy.js        5 個主題、首頁問題入口、換個角度、首頁讀者心得
    _legacy-*.js(on)   從舊版 index.html 原封不動取出的書介、通路、心得
  components/
    layout.js          head／SEO／導覽／footer／麵包屑（每頁共用）
    ui.js              書封、書目、通路連結、心得、優惠、電子報、營業時間、問題入口
    _kit-form.html     舊站 Kit 電子報表單（原樣保留）
  pages/               各頁模板：home、book、catalog（書目／主題）、info、order
assets/
  css/site.css         Design System（色彩、字體、間距等變數都在最上方）
  js/main.js           全站互動（選單、問題入口、營業時間、表單、追蹤）
  js/order.js          訂購單計價
gas/Code.gs            Google Apps Script：收訂單、讀後感、聯絡訊息
build.js               建置腳本
```

## 常見修改

| 想改什麼 | 改哪裡 |
|---|---|
| 電話、營業時間、Email、匯款帳號、優惠價格 | `src/config.js` |
| 書的介紹、適合誰、入口句 | `src/data/books.js` |
| 首頁問題入口、主題分組 | `src/data/taxonomy.js` |
| 顏色、字級 | `assets/css/site.css` 最上方 `:root` |

改完執行 `node build.js` 重新建置。

## 啟用表單收件（Google Apps Script）

1. 用 createbook.press@gmail.com 登入，開一份新的 Google 試算表。
2. 「擴充功能 → Apps Script」，貼上 `gas/Code.gs` 全部內容並儲存。
3. 「部署 → 新增部署作業 → 網頁應用程式」，執行身分「我」，存取權「所有人」。
4. 把產生的網址貼到 `src/config.js` 的 `FORM_ENDPOINT`，重新建置。

還沒設定前，訂購單、讀後感、聯絡表單都會改用「Email 寄出」，功能不會壞。

## 啟用 GA4

把評估 ID（G-XXXXXXX）填進 `src/config.js` 的 `GA_ID`，重新建置。已內建的事件：
`question_select`、`book_click`、`add_to_order`、`purchase_request`（轉換）、`outbound_bookstore`、
`tel_click`、`email_click`、`newsletter_submit`、`review_submit`、`contact_submit`、`bookclub_click`、`bookclub_signup`。
建議在 GA4 把 `purchase_request` 標為「關鍵事件」。

## 舊網址相容

- `/purchase.html` → `/order/`；`/contact.html` → `/contact/`
- `/?book=fumu` → `/books/love-your-parents/`；`/?cat=婚姻` → `/topics/love-marriage/`

## 部署注意

- `CNAME` 內容是 `books.hellenchentruegroup.com`（GitHub Pages 自訂網域用）。若不是用 GitHub Pages，可刪除。
- 6 個 github.io 專屬頁建議在 `<head>` 加上：
  `<link rel="canonical" href="https://books.hellenchentruegroup.com/books/對應代號/">`，
  讓搜尋權重集中到主網域；專屬頁仍可保留作為廣告落地頁。
