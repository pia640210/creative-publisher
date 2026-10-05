// 書籍資料：單一資料來源。
// _legacy-books.js / _legacy-series.json 是從舊版 index.html 原封不動取出的內容（書介、編輯推薦、通路、讀者心得）。
// 這裡只「新增」讀者導向的欄位：hook（入口句）、fitIf（適合你，如果……）、takeaway（讀完可能帶走）。
// 新增欄位全部改寫自既有書介與編輯推薦，沒有加入書中沒有的觀點；上線前請編輯確認。
const legacy = require('./_legacy-books.js');
const series = require('./_legacy-series.json');

const ENRICH = {
  ziji: {
    slug: 'stand-up', topic: 'know-yourself',
    hook: '表面上都說得過去，心裡卻一直不踏實？',
    fitIf: [
      '你在感情或人生裡，總是在同一個地方卡住。',
      '你常覺得事情「就這樣發生了」，說不出那是不是自己選的。',
      '你想學會獨立：不只是不依賴別人，而是為自己的選擇負責。',
    ],
    takeaway: ['看清楚哪些選擇是你自己做的，哪些只是讓事情發生。', '一個起點：幸福不是運氣，是從對自己誠實開始練的能力。'],
    edition: { label: '2012 年《敗犬站起來》的全新改版', relatedKey: 'baiquan' },
    site: 'https://pia640210.github.io/standup-by-yourself/',
  },
  zuoji: {
    slug: 'be-yourself', topic: 'know-yourself',
    hook: '在人群裡待久了，越來越不知道自己是誰？',
    fitIf: [
      '你常配合別人，回過頭才發現自己的意願不見了。',
      '你想做自己，又怕被說成自私。',
      '你想學會拿捏進退，而不是一味忍讓，或乾脆任性。',
    ],
    takeaway: ['分清楚「做自己」和「只顧自己」差在哪裡。', '一條量身訂做、由你自己決定的路，該怎麼開始走。'],
    site: 'https://pia640210.github.io/Be-yourself/',
  },
  shibai: {
    slug: 'how-i-failed', topic: 'know-yourself',
    hook: '一直在反省，卻還是不知道自己哪裡出了錯？',
    fitIf: [
      '你很努力，結果卻常常不如預期。',
      '你想知道自己現在的人生階段，是在正軌還是已經出軌。',
      '你對世俗那套「成功」「失敗」的定義感到疲憊。',
    ],
    takeaway: ['一張以「每十年一個階段」來檢查自己的人生定位表。', '作者拿自己真實的失敗當借鏡，而不是高高在上講道理。'],
    site: 'https://pia640210.github.io/how-did-I-fail/',
  },
  mengxiang: {
    slug: 'dream-or-delusion', topic: 'dreams-direction',
    hook: '心裡那個一直想要的東西，是夢想，還是妄想？',
    fitIf: [
      '你有一件想做的事，卻怎麼樣都完成不了。',
      '你常在理想和現實之間擺盪。',
      '你懷疑自己是不是一開始就走歪了。',
    ],
    takeaway: ['分辨夢想與妄想的方法。', '把夢想落地的基本功，以及替自己人生打分數的角度。'],
  },
  zhumeng: {
    slug: 'dream-builder', topic: 'dreams-direction',
    hook: '有一個不想放棄的夢，卻不知道從哪裡開始蓋？',
    fitIf: [
      '你正在追一個夢，不管它是大是小。',
      '你有很多熱情，卻總覺得基本功不夠。',
      '你想把白日夢一點一點變成生活。',
    ],
    takeaway: ['從「生、命、夢、想、產、品、創、造、圓、滿」十個字，用十種角度看築夢。', '為什麼築夢者一定要持續進步成長。'],
  },
  shenghuo: {
    slug: 'life-artist', topic: 'life-wisdom',
    hook: '日子不是過不下去，只是覺得可以過得更好？',
    fitIf: [
      '你想讓平凡的日常多一點精彩。',
      '你追求的是「好，還要更好」。',
      '你好奇聊天、烹飪、戀愛這些日常小事，怎麼變成一種藝術。',
    ],
    takeaway: ['二十七個章節，從生活的每個面向重新看日子。', '藝術用的材料是生命本身，所以人人都能當生活藝術家。'],
  },
  rensheng10: {
    slug: 'ten-lessons', topic: 'dreams-direction',
    hook: '有些事，學校沒教、爸媽沒說、老闆也不會告訴你。',
    fitIf: [
      '你剛站上人生的起跑點，想找一個方向。',
      '你已經有些成就，卻總覺得少了什麼。',
      '你想找朋友一起讀、一起討論。',
    ],
    takeaway: ['十堂深入淺出的生活哲學，每一章都是一堂課。', '可以一個人讀，也很適合一起討論。'],
    site: 'https://pia640210.github.io/10-Lessons/',
  },
  jingtian: {
    slug: 'forever-young', topic: 'life-wisdom',
    hook: '身分證上的數字，真的決定你是幾歲嗎？',
    fitIf: [
      '你覺得自己開始「老了」，不只是身體，還有心態。',
      '你想養身，也想養心。',
      '你希望自己越活越有價值（副標說：8 歲到 108 歲都必讀）。',
    ],
    takeaway: ['從身、心、靈三個層面談「永齡長春」。', '大量 Q&A，陪你想清楚自己想活成幾歲的樣子。'],
    site: 'https://pia640210.github.io/forever-young/',
  },
  sajiao: {
    slug: 'sajiao', topic: 'relationships',
    hook: '人和人能不能親近，靠的常常不是道理，而是「舒服」。',
    fitIf: [
      '你覺得人際關係有點僵、有點累。',
      '你小時候會撒嬌，長大後卻不敢了。',
      '你想讓相處更圓融、更討喜。',
    ],
    takeaway: ['撒嬌有什麼好處、你為什麼不敢、該怎麼練習。', '一種讓雙方都舒服的溝通方式。'],
  },
  fumu: {
    slug: 'love-your-parents', topic: 'relationships',
    hook: '明明很愛父母，為什麼一開口就變成爭吵？',
    fitIf: [
      '你很愛父母，但每次回家總會為了小事起衝突。',
      '你常想「他們為什麼就是不懂我」，卻沒想過反過來問。',
      '你希望在父母還在的時候，好好把心裡的愛說出來。',
    ],
    takeaway: ['書中把父母分成 12 種類型，並整理出 11 種子女表達愛的方式，可以對照自己家裡的情況。', '一個新的角度：你對父母了解多深，就決定了你能愛他們多深。'],
  },
  lihun: {
    slug: 'divorce-black-book', topic: 'love-marriage', stage: 'marriage',
    hook: '能坦然面對失去，才可能真正擁有一段婚姻。',
    fitIf: [
      '你的婚姻正在卡關，想冷靜看清楚。',
      '你離過婚，或正要嫁娶離過婚的人。',
      '你想把婚姻經營得更長久。',
    ],
    takeaway: ['六個真實案例與十四個常見問答。', '它談的是「離」，目的卻是「合」。'],
  },
  waiyou: {
    slug: 'on-the-edge', topic: 'love-marriage', stage: 'marriage',
    hook: '與其害怕外遇，不如先弄懂它從哪裡來。',
    fitIf: [
      '你正在面對婚外情，不知道該怎麼辦。',
      '你想預防，讓婚姻少踩一顆地雷。',
      '你身在第三者的位置，想冷靜想一想。',
    ],
    takeaway: ['剖析外遇的各種心態與理由。', '真實案例、問答，以及實際的解套方向。'],
  },
  meipo: {
    slug: 'matchmaker', topic: 'love-marriage', stage: 'single',
    hook: '為什麼婚姻不好，人生不會真正好？',
    fitIf: [
      '你對婚姻有點怕，又有點期待。',
      '你想知道一位促成許多佳偶的媒人，怎麼看婚姻這件事。',
      '你還想相信，好的婚姻是可能的。',
    ],
    takeaway: ['作者多年作媒累積的一套婚姻哲學。'],
  },
  xinliang: {
    slug: 'bride-school', topic: 'love-marriage', stage: 'single',
    hook: '想結婚，卻一直找不到方向？',
    fitIf: [
      '你想結婚，但還沒有對象。',
      '你有對象，卻總是搞不定對方。',
      '你離過婚，想再給婚姻一次機會。',
    ],
    takeaway: ['14 位新娘、6 位新郎的真實幸福分享。', '把擇偶方向和婚姻觀建立起來。'],
  },
  xunqing: {
    slug: 'love-adventure', topic: 'love-marriage', stage: 'single',
    hook: '一直遇不到對的人，問題可能不在運氣。',
    fitIf: [
      '你很想結婚，卻摸不清自己卡在哪裡。',
      '你想知道自己在感情裡有哪些沒發現的盲點。',
      '你想盤點自己的優勢，和需要改進的地方。',
    ],
    takeaway: ['一張專屬於你的對象檢查表。', '由同名工作坊整理成書。'],
  },
  baiquan: {
    slug: 'underdog-stand-up', topic: 'love-marriage', stage: 'single',
    hook: '門其實沒鎖，只是我們一直以為打不開。',
    fitIf: [
      '你渴望幸福，卻遲遲踏不出那一步。',
      '你發現自己常用同樣的理由，留在原地。',
      '你想知道自己到底卡在哪裡。',
    ],
    takeaway: ['淪為「敗犬」的理由與常見藉口，一層層剝開來看。'],
    edition: { label: '2012 年版，全新改版為《自己站起來》', relatedKey: 'ziji' },
  },
  zhuiai: {
    slug: 'chasing-love', topic: 'love-marriage', stage: 'dating',
    hook: '追到之後，故事才真正開始。',
    fitIf: [
      '你手上有一個想追的人。',
      '你想談一輩子的戀愛，不只是熱戀那幾個月。',
      '你老是在感情裡掉進同樣的陷阱。',
    ],
    takeaway: ['從告白到長久經營的基本功。', '別只找「情投意合」的人，要找願意跟你一起進步的人。'],
  },
};

// 系列書：一個系列一頁，頁內分冊
const SERIES = {
  art: {
    key: 'art', slug: 'art-of-conversation', topic: 'relationships', isSeries: true,
    title: '說話的藝術', volumesLabel: '全 3 冊', cat: '溝通',
    img: 'images/說話的藝術1.jpg',
    tagline: '講對話讓你上天堂，說錯話讓你見閻王。',
    hook: '明明是好意，為什麼說出口就變了？',
    fitIf: [
      '你常在話說完之後才後悔。',
      '你想把話說得真誠，又說得圓融。',
      '你需要在職場、演講或談判裡好好表達。',
    ],
    takeaway: ['三冊由淺入深：用 Q&A 起步、練說話基本功、面對不同場合與對象。', '技巧再好，都比不上你真正想表達的心意。'],
    desc: '作者以二十年以上的專業諮詢經歷，把「說話」這門功課拆成三冊：從日常最常見的說話問題，到口齒、聲音語調、肢體語言的基本功，再到職場、演講、談判等特殊場合。每個人都要找出屬於自己的說話格調——這是值得終生學習的功課。',
    quote: { text: '技巧只是表達心意的技術，凌駕其上的則是真誠的意念與生命力。', cite: '陳海倫，《說話的藝術3》自序' },
    site: 'https://pia640210.github.io/The-art-of-conversation/',
    volumes: series.artModal,
  },
  chen: {
    key: 'chen', slug: 'advisor-time', topic: 'life-wisdom', isSeries: true,
    title: '陳顧問時間', volumesLabel: '全 3 冊', cat: '生活指導',
    img: 'images/陳顧問時間3.jpg',
    tagline: '人生有沒有顧問，差很多。',
    hook: '如果人生有一位顧問，你最想問他什麼？',
    fitIf: [
      '你有些問題想了很久，卻找不到人可以問。',
      '你想看看別人遇到問題時，是怎麼被引導著想通的。',
      '你喜歡隨手翻、一次讀一題的書。',
    ],
    takeaway: ['真實諮詢案例與大量 Q&A。', '學會把問題問得更精準——因為會問，才會學。'],
    desc: '陳海倫把多年來被諮詢的真實案例收錄成書。同樣的問題，問的人不同，答案就不同，因為每個人都有屬於自己的答案。三冊分別從真實案例、面對問題的能力，以及分辨「誰的問題」切入。',
    volumes: series.chenModal,
  },
  youqing: {
    key: 'youqing', slug: 'lovers', topic: 'love-marriage', stage: 'dating', isSeries: true,
    title: '有情人', volumesLabel: '全 2 冊', cat: '婚姻',
    img: 'images/有情人.jpg',
    tagline: '玩真的，還是玩假的？',
    hook: '在一起之後，才發現感情需要學。',
    fitIf: [
      '你還沒結婚，卻一直鼓不起勇氣。',
      '你剛結婚，正在磨合期裡手忙腳亂。',
      '你和另一半總為同樣的事爭吵，或感情正遇上父母的反對。',
    ],
    takeaway: ['分清楚什麼樣的人只能當點頭之交，什麼樣的人值得託付終身。', '作者一句話貫穿全書：沒有處不來的夫妻，只有不進步的情人。'],
    desc: '集結十場講座與真人真事的現身說法。第一冊從兩性關係談到結婚，第二冊把重點推進到婚姻，把愛情、婚姻、外遇的現實與幻想一次解碼。',
    volumes: series.youqingModal,
  },
};

// 系列各冊的訂購用代號與定價（[待確認] 系列單冊定價先以 NT$380 計）
const VOLUME_KEYS = {
  art: ['art1', 'art2', 'art3'],
  chen: ['chen1', 'chen2', 'chen3'],
  youqing: ['youqing1', 'youqing2'],
};
const VOLUME_SHORT = { art: ['說話的藝術 1', '說話的藝術 2', '說話的藝術 3'], chen: ['陳顧問時間 1', '陳顧問時間 2', '陳顧問時間 3'], youqing: ['有情人 I', '有情人 II'] };

function priceNum(p) { return Number(String(p || '380').replace(/[^0-9]/g, '')) || 380; }

const books = [];
for (const [key, base] of Object.entries(legacy)) {
  const e = ENRICH[key];
  books.push({ key, ...base, ...e, price: priceNum(base.price), links: base.links || [], reviews: base.reviews || [], editor: base.editor || [] });
}
for (const s of Object.values(SERIES)) {
  s.volumes = s.volumes.map((v, i) => ({ ...v, orderKey: VOLUME_KEYS[s.key][i], shortTitle: VOLUME_SHORT[s.key][i], price: 380 }));
  s.reviews = s.volumes.flatMap(v => v.reviews.map(r => ({ ...r, vol: v.shortTitle })));
  s.price = 380;
  books.push(s);
}

const byKey = Object.fromEntries(books.map(b => [b.key, b]));
const bySlug = Object.fromEntries(books.map(b => [b.slug, b]));

// 訂購清單：系列拆成單冊
const orderItems = [];
for (const b of books) {
  if (b.isSeries) b.volumes.forEach(v => orderItems.push({ key: v.orderKey, title: v.shortTitle, price: v.price, img: v.img, series: b.key }));
  else orderItems.push({ key: b.key, title: b.title, price: b.price, img: b.img });
}

module.exports = { books, byKey, bySlug, orderItems };
