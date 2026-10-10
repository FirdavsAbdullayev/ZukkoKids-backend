/**
 * Do'kon (shop) va o'yinlar katalogi.
 * Narxlar faqat serverda saqlanadi — client narxni o'zgartira olmaydi.
 */

// ---- Do'kon buyumlari ----
// kind:
//   'reward' — bir marta sotib olinadigan mukofot (logistika/imtiyoz)
//   'unlock' — ochilish kaliti (masalan multfilm kutubxonasi)
const SHOP_ITEMS = [
  {
    key: 'cartoon_pass',
    title: 'Multfilm kutubxonasi',
    price: 50,
    kind: 'unlock',
    icon: 'clapperboard',
    description: 'Multfilmlar bo\'limidagi barcha videolarni ochadi',
  },
  {
    key: 'game_time_10',
    title: "10 daqiqa o'yin vaqti",
    price: 30,
    kind: 'reward',
    icon: 'gamepad',
    description: 'Ota-ona bilan kelishilgan o\'yin vaqti',
  },
  {
    key: 'cartoon_choice',
    title: 'Multfilm tanlash huquqi',
    price: 60,
    kind: 'reward',
    icon: 'film',
    description: 'Bugungi multfilmni bola o\'zi tanlaydi',
  },
  {
    key: 'park_trip',
    title: "Hovlida sayohat o'yini",
    price: 80,
    kind: 'reward',
    icon: 'tree',
    description: 'Hovlida yangi o\'yin qoidalari bilan sayohat',
  },
  {
    key: 'pizza_night',
    title: 'Pitsa kechasi',
    price: 120,
    kind: 'reward',
    icon: 'pizza',
    description: 'Hafta oxiri uchun pitsa kechasi',
  },
];

// ---- Mini-o'yinlar ----
// price: 0 = bepul, >0 = tangani to'lasa ochiladi
// min_score: shu ballga yetilsa birinchi marta mukofot beriladi
const GAMES = [
  {
    key: 'memory',
    title: 'Xotira kartalari',
    price: 0,
    reward_coins: 5,
    min_score: 50,
    players: 1,
    icon: 'brain',
    description: 'Rasm kartalarini juftlab top — xotirangni mashq qil!',
  },
  {
    key: 'tictactoe',
    title: 'Triq (Tic-Tac-Toe)',
    price: 0,
    reward_coins: 5,
    min_score: 60,
    players: 1,
    icon: 'grid',
    description: 'Kompyuterga qarshi o\'yna — uchta X yoki O qo\'y!',
  },
  {
    key: 'odd_one_out',
    title: 'Chap-topoq',
    price: 20,
    reward_coins: 8,
    min_score: 60,
    players: 1,
    icon: 'search',
    description: 'To\'rtta rasmdan boshqacha bo\'lganini top',
  },
  {
    key: 'simon',
    title: 'Simon eslab qol',
    price: 25,
    reward_coins: 10,
    min_score: 50,
    players: 1,
    icon: 'music',
    description: 'Ranglar tartibini takrorla — qancha eslasang shuncha yaxshi',
  },
  {
    key: 'balloon_pop',
    title: 'Balon urish',
    price: 30,
    reward_coins: 10,
    min_score: 60,
    players: 1,
    icon: 'target',
    description: '20 soniya ichida imkon qadar ko\'p balon ur',
  },
  {
    key: 'number_hunt',
    title: 'Raqamlar ovi',
    price: 30,
    reward_coins: 12,
    min_score: 60,
    players: 1,
    icon: 'hash',
    description: 'Tez hisoblangan savollarga javob ber',
  },
  {
    key: 'shapes_colors',
    title: 'Shakl va ranglar',
    price: 25,
    reward_coins: 10,
    min_score: 60,
    players: 1,
    icon: 'shapes',
    description: 'Shakl va ranglarni bir-biridan ajrat',
  },
  {
    key: 'maze',
    title: 'Labirint',
    price: 40,
    reward_coins: 15,
    min_score: 60,
    players: 1,
    icon: 'map',
    description: 'Strelka tugmalari bilan labirintdan yulduzga yet',
  },
];

const SHOP_MAP = Object.fromEntries(SHOP_ITEMS.map((i) => [i.key, i]));
const GAME_MAP = Object.fromEntries(GAMES.map((g) => [g.key, g]));

/** Berilgan kalit bo'yicha do'kon yoki o'yin elementini topadi. */
function findCatalogItem(key) {
  if (!key) return null;
  return SHOP_MAP[key] || GAME_MAP[key] || null;
}

/** Do'kon sahifasi uchun yagona ro'yxat (reward + unlock + games). */
function getShopCatalog() {
  const shop = SHOP_ITEMS.map((i) => ({ ...i, kind: i.kind }));
  const games = GAMES.map((g) => ({
    key: g.key,
    title: g.title,
    price: g.price,
    kind: 'game',
    icon: g.icon,
    description: g.description,
  }));
  return [...shop, ...games];
}

module.exports = {
  SHOP_ITEMS,
  GAMES,
  SHOP_MAP,
  GAME_MAP,
  findCatalogItem,
  getShopCatalog,
};
