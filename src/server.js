require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5000;

// ---- Global himoya: hech qanday xato serverga jimgina qulashiga yo'l qo'ymaydi ----
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught exception:', err);
});

async function startServer() {
  try {
    // DB ulanishini tekshirish
    await db.sequelize.authenticate();
    console.log('🔌 PostgreSQL bilan ulanish muvaffaqiyatli.');

    // Tablitsalarni yaratish (mavjud bo'lmasa)
    await db.sequelize.sync();
    console.log('🗄  Model tablitsalari sinxronlashtirildi.');

    // Bo'sh bazada darslarni avtomatik seed qilish (yangi deploy uchun qulay)
    try {
      const lessonCount = await db.Lesson.count();
      if (lessonCount === 0) {
        const lessons = require('./data/lessons');
        for (const lesson of lessons) {
          await db.Lesson.findOrCreate({
            where: { title: lesson.title },
            defaults: lesson,
          });
        }
        console.log(`🌱 ${lessons.length} ta dars bazaga avtomatik qo'shildi.`);
      }
    } catch (seedErr) {
      console.error('⚠️ Avtomatik seed xatosi:', seedErr.message);
    }

    const server = app.listen(PORT, () => {
      console.log(`
  ╔═══════════════════════════════════════════╗
  ║   🎓 ZukkoKids Server ishga tushdi!       ║
  ║   🌐 Port:  ${PORT}
  ║   📖 Docs:  /api-docs                     ║
  ╚═══════════════════════════════════════════╝`);
    });

    // Port band bo'lsa (masalan eski server hali ishlab turibdi) — 
    // xato 'error' event sifatida keladi va handle qilinmasa server qulaydi.
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ ${PORT} porti allaqachon band. Eski serverni to'xtating:`);
        console.error(`   netstat -ano | findstr :${PORT}`);
        console.error(`   taskkill /PID <pid> /F`);
      } else {
        console.error('❌ Server xatosi:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Serverni ishga tushirishda xatolik:', err.message);
    process.exit(1);
  }
}

startServer();
