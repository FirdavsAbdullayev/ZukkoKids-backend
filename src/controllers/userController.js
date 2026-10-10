const { User, Lesson, UserProgress, sequelize } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * POST /api/users
 * Yangi bola (foydalanuvchi) profili yaratadi.
 */
const createUser = async (req, res, next) => {
  try {
    const { name, age, parent_email, avatar_url } = req.body;

    const user = await User.create({
      name,
      age,
      parent_email,
      avatar_url: avatar_url || null,
      coins_balance: 0,
      stars_count: 0,
    });

    return res.status(201).json({
      success: true,
      message: `Xush kelibsiz, ${user.name}! Profilingiz yaratildi.`,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/users/:id
 * Bitta foydalanuvchini olish.
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/users/:id/progress
 * Bolaning tangalari, yulduzlari va tugatgan darslari.
 */
const getUserProgress = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    const progress = await UserProgress.findAll({
      where: { user_id: userId, completed: true },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'category', 'rewards_coins', 'difficulty'],
        },
      ],
      order: [['completed_at', 'DESC']],
    });

    // Kategoriya bo'yicha hisob-kitob
    const categoryStats = {};
    for (const p of progress) {
      const cat = p.lesson?.category || 'unknown';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { completed_count: 0, total_score: 0 };
      }
      categoryStats[cat].completed_count += 1;
      categoryStats[cat].total_score += p.score;
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          coins_balance: user.coins_balance,
          stars_count: user.stars_count,
        },
        completed_lessons: progress.map((p) => ({
          id: p.id,
          score: p.score,
          completed_at: p.completed_at,
          time_spent_seconds: p.time_spent_seconds,
          lesson: p.lesson,
        })),
        stats: {
          total_completed: progress.length,
          total_time_seconds: progress.reduce((a, p) => a + (p.time_spent_seconds || 0), 0),
          average_score:
            progress.length > 0
              ? Math.round(progress.reduce((a, p) => a + p.score, 0) / progress.length)
              : 0,
          by_category: categoryStats,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/users
 * Barcha foydalanuvchilar ro'yxati ( ParentsDashboard uchun ).
 */
const listUsers = async (_req, res, next) => {
  try {
    const users = await User.findAll({
      order: [['created_at', 'DESC']],
      attributes: { exclude: [] },
    });
    return res.json({ success: true, data: users });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/users/:id/purchases — shopController.js da (xarid qilish/ochish)
 * GET  /api/users/:id/purchases — shopController.js da (sotib olinganlar)
 */

module.exports = { createUser, getUserById, getUserProgress, listUsers };
