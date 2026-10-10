/**
 * Darslarning (lessons) namunaviy ma'lumotlari.
 * Bu ro'yxat `scripts/seed.js` (qo'lda seed) va `src/server.js` (bazasi bo'sh
 * bo'lganda avtomatik seed) tomonidan birgalikda ishlatiladi.
 */
module.exports = [
  // ===== ALPHABET =====
  { title: 'Alifbo: A, B, C harflari bilan tanishuv', category: 'alphabet', rewards_coins: 15, difficulty: 'easy' },
  { title: 'Alifbo: O\'zbek harflari (O, G\', N, H)', category: 'alphabet', rewards_coins: 20, difficulty: 'easy' },
  { title: 'Alifbo: Unli va undosh harflar', category: 'alphabet', rewards_coins: 25, difficulty: 'medium' },
  { title: 'Alifbo: Harflarni tovushlarga ajratish', category: 'alphabet', rewards_coins: 20, difficulty: 'easy' },
  { title: 'Alifbo: Birlashtirib o\'qish (BA, BO, BU)', category: 'alphabet', rewards_coins: 30, difficulty: 'medium' },

  // ===== NUMBERS =====
  { title: 'Raqamlar: 1 dan 10 gacha sanash', category: 'numbers', rewards_coins: 15, difficulty: 'easy' },
  { title: 'Raqamlar: 11 dan 20 gacha sanash', category: 'numbers', rewards_coins: 20, difficulty: 'easy' },
  { title: 'Raqamlar: Qo\'shish (1+1 dan 5+5 gacha)', category: 'numbers', rewards_coins: 25, difficulty: 'medium' },
  { title: 'Raqamlar: Ayirish (10 dan kam)', category: 'numbers', rewards_coins: 30, difficulty: 'medium' },
  { title: 'Raqamlar: Naqshlar va ketma-ketliklar', category: 'numbers', rewards_coins: 35, difficulty: 'hard' },

  // ===== ENGLISH =====
  { title: 'English: Hello! Greeting words', category: 'english', rewards_coins: 15, difficulty: 'easy' },
  { title: 'English: Colors (Qizil, Ko\'k, Yashil...)', category: 'english', rewards_coins: 20, difficulty: 'easy' },
  { title: 'English: Animals (Cat, Dog, Bird...)', category: 'english', rewards_coins: 25, difficulty: 'easy' },
  { title: 'English: Family members (Mom, Dad...)', category: 'english', rewards_coins: 25, difficulty: 'medium' },
  { title: 'English: Numbers 1-20 in English', category: 'english', rewards_coins: 30, difficulty: 'medium' },

  // ===== STEM =====
  { title: 'STEM: Asosiy ranglar bilan tanishuv', category: 'stem', rewards_coins: 15, difficulty: 'easy' },
  { title: 'STEM: Shakillar (Kvadrat, Doira, Uchburchak)', category: 'stem', rewards_coins: 20, difficulty: 'easy' },
  { title: 'STEM: Ob-havo va fasllar', category: 'stem', rewards_coins: 25, difficulty: 'medium' },
  { title: 'STEM: Ichki organlar (Yurak, O\'pka)', category: 'stem', rewards_coins: 35, difficulty: 'hard' },
  { title: 'STEM: Sayyoralarning nomlari', category: 'stem', rewards_coins: 40, difficulty: 'hard' },
];
