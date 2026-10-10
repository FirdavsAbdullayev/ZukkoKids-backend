const { Lesson, User, UserProgress, sequelize } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * GET /api/lessons
 * Barcha darslar ro'yxati. ?category=alphabet bo'yicha filterlanadi.
 */
const listLessons = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const lessons = await Lesson.findAll({
      where,
      order: [['category', 'ASC'], ['id', 'ASC']],
    });

    // Kategoriya bo'yicha guruhlash (frontend qulayligi uchun)
    const grouped = lessons.reduce((acc, lesson) => {
      const cat = lesson.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(lesson);
      return acc;
    }, {});

    return res.json({
      success: true,
      count: lessons.length,
      data: lessons,
      grouped,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/lessons/:id
 */
const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) throw new ApiError(404, 'Dars topilmadi');
    return res.json({ success: true, data: lesson });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/lessons/complete
 * Dars tugatilganda tangalarni hisoblaydi va progressni yangilaydi.
 * Agar dars avval tugatilgan bo'lsa, qayta mukofot BERMAYDI.
 */
const completeLesson = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();

    const { user_id, lesson_id, score = 100, time_spent_seconds = 0 } = req.body;

    const user = await User.findByPk(user_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    const lesson = await Lesson.findByPk(lesson_id, { transaction: t });
    if (!lesson) throw new ApiError(404, 'Dars topilmadi');

    let progress = await UserProgress.findOne({
      where: { user_id, lesson_id },
      transaction: t,
    });

    if (progress && progress.completed) {
      await t.rollback();
      t = null;
      return res.status(200).json({
        success: true,
        already_completed: true,
        message: "Bu dars avval tugatilgan edi. Qo'shimcha mukofot berilmaydi.",
        data: {
          coins_balance: user.coins_balance,
          stars_count: user.stars_count,
          score: progress.score,
        },
      });
    }

    const earnedCoins = lesson.rewards_coins;
    // Yulduz: score 90+ = 3 yulduz, 70+ = 2, 50+ = 1, past = 0
    let earnedStars = 0;
    if (score >= 90) earnedStars = 3;
    else if (score >= 70) earnedStars = 2;
    else if (score >= 50) earnedStars = 1;

    if (progress) {
      // Progressni yangilash
      progress.completed = true;
      progress.score = score;
      progress.time_spent_seconds = time_spent_seconds;
      progress.completed_at = new Date();
      await progress.save({ transaction: t });
    } else {
      // Yangi progress yaratish
      progress = await UserProgress.create(
        {
          user_id,
          lesson_id,
          completed: true,
          score,
          time_spent_seconds,
          completed_at: new Date(),
        },
        { transaction: t }
      );
    }

    // User balansini yangilash
    user.coins_balance += earnedCoins;
    user.stars_count += earnedStars;
    await user.save({ transaction: t });

    await t.commit();
    t = null;

    return res.status(201).json({
      success: true,
      message: `Tabriklaymiz! Siz "${lesson.title}" darsini yakunladingiz!`,
      data: {
        earned_coins: earnedCoins,
        earned_stars: earnedStars,
        coins_balance: user.coins_balance,
        stars_count: user.stars_count,
        progress,
      },
    });
  } catch (err) {
    if (t) await t.rollback().catch(() => {}); // xavfsiz rollback
    return next(err);
  }
};

module.exports = { listLessons, getLessonById, completeLesson };
