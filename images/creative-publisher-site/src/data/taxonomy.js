// 主題（取代舊的 6 個分類）與「你最近在想什麼？」問題入口
const topics = [
  {
    slug: 'know-yourself', name: '認識自己', voice: '我好像越來越不知道自己要什麼。',
    intro: '有些時候，卡住我們的不是外面的事，而是我們已經很久沒有好好看看自己。這幾本書不給標準答案，陪你把「我到底想要什麼」慢慢想清楚。',
    books: ['ziji', 'zuoji', 'shibai'], start: 'ziji',
  },
  {
    slug: 'dreams-direction', name: '夢想與人生方向', voice: '我很努力，卻不知道自己在忙什麼。',
    intro: '想要的東西很多，真正走得到的路卻不清楚。這幾本書陪你分辨夢想和妄想，把方向找回來，再一步一步走過去。',
    books: ['mengxiang', 'zhumeng', 'rensheng10'], start: 'mengxiang',
  },
  {
    slug: 'relationships', name: '好好與人相處', voice: '明明是好意，說出口就變了。',
    intro: '和同事、朋友、父母之間的距離，常常就差在一句話怎麼說。這幾本書談的不是話術，而是怎麼讓心意被聽見。',
    books: ['art', 'sajiao', 'fumu'], start: 'art',
  },
  {
    slug: 'love-marriage', name: '愛情與婚姻', voice: '我們一直在吵同一件事。',
    intro: '從還在找對的人、到在一起之後的經營、再到婚姻裡的難關，每個階段的問題都不一樣。先找到你現在在哪一站。',
    books: ['xunqing', 'baiquan', 'xinliang', 'meipo', 'zhuiai', 'youqing', 'waiyou', 'lihun'], start: 'youqing',
    stages: [
      { key: 'single', name: '還在找那個對的人', books: ['xunqing', 'baiquan', 'xinliang', 'meipo'] },
      { key: 'dating', name: '在一起之後，想好好經營', books: ['zhuiai', 'youqing'] },
      { key: 'marriage', name: '婚姻遇上了難關', books: ['waiyou', 'lihun'] },
    ],
  },
  {
    slug: 'life-wisdom', name: '生活的智慧', voice: '我想把日子過得更像自己。',
    intro: '生活裡的問題不一定很大，卻天天都在。這幾本書像身邊一位有經驗的顧問，陪你把日子過得更有精神、更有滋味。',
    books: ['chen', 'jingtian', 'shenghuo'], start: 'chen',
  },
];

// 首頁問題入口：用讀者自己會說的話
const questions = [
  { key: 'self', text: '我好像越來越不知道自己要什麼', books: ['zuoji', 'ziji', 'shibai'] },
  { key: 'next', text: '我很努力，卻不知道下一步怎麼走', books: ['rensheng10', 'shibai', 'chen'] },
  { key: 'dream', text: '我想重新找回心裡的那個夢', books: ['mengxiang', 'zhumeng'] },
  { key: 'talk', text: '明明是好意，說出口就變了', books: ['art', 'sajiao'] },
  { key: 'family', text: '很愛家人，卻總是說不到一起', books: ['fumu', 'art'] },
  { key: 'couple', text: '我和另一半一直在吵同一件事', books: ['youqing', 'waiyou', 'lihun'] },
  { key: 'single', text: '我還在找那個對的人', books: ['xunqing', 'zhuiai', 'xinliang'] },
  { key: 'life', text: '我想把日子過得有精神一點', books: ['jingtian', 'shenghuo', 'chen'] },
];

// 「換個角度」：品牌的「創意」用例子呈現。每一組都改寫自該書既有內容。
const angles = [
  { before: '父母就是不懂我。', after: '也許，是我還不夠了解他們。', book: 'fumu' },
  { before: '做自己，就是不管別人怎麼想。', after: '做自己，和只顧自己，是兩回事。', book: 'zuoji' },
  { before: '我又失敗了。', after: '可怕的不是失敗，是不知道為什麼失敗。', book: 'shibai' },
];

// 首頁讀者的話（沿用舊站真實心得，未新增）
const testimonials = [
  { text: '《陳顧問時間》就像鎖匠師傅，可以即時開鎖救援。只是要把壞習慣根除，還是要靠自己的努力！', name: '鄭先生', book: 'chen' },
  { text: '本來只想買一本《有情人》，看完覺得不把《有情人II》一起買回去，實在太可惜了！', name: '潘先生，新北市', book: 'youqing' },
  { text: '我相信這絕對是一套講溝通的聖經。', name: '吳先生，台北', book: 'art' },
];

const featured = ['ziji', 'fumu', 'art', 'chen', 'mengxiang', 'youqing'];

// 舊網址相容：?cat= 與 ?book= 轉到新頁面
const legacyCat = { '自我探索': 'know-yourself', '生活指導': 'life-wisdom', '婚姻': 'love-marriage', '兩性': 'love-marriage', '溝通': 'relationships', '親子': 'relationships' };

module.exports = { topics, questions, angles, testimonials, featured, legacyCat };
