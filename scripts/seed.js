/**
 * Darslar (lessons) namunaviy ma'lumotlari bilan to'ldiradi.
 * Ishlatish: npm run db:seed
 */
require('dotenv').config();
const db = require('../src/models');
const lessons = require('../src/data/lessons');

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('🔄 Model sincronlash tayyor...');

    for (const lesson of lessons) {
      const [record, created] = await db.Lesson.findOrCreate({
        where: { title: lesson.title },
        defaults: lesson,
      });
      if (created) {
        console.log(`➕ Qo'shildi: [${record.category}] ${record.title}`);
      } else {
        console.log(`⏭  Mavjud: [${record.category}] ${record.title}`);
      }
    }

    const count = await db.Lesson.count();
    console.log(`\n✅ Seed yakunlandi. Umumiy darslar soni: ${count}`);
  } catch (err) {
    console.error('❌ Seed xatosi:', err.message);
    process.exitCode = 1;
  } finally {
    await db.sequelize.close();
  }
}

seed();
