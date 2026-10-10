const { User, GameProgress, sequelize } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { GAMES, GAME_MAP } = require('../config/catalog');

/**
 * GET /api/games
 * O'yinlar katalogi (kalit, nom, narx, mukofot).
 */
const listGames = async (_req, res, next) => {
  try {
    return res.json({
      success: true,
      count: GAMES.length,
      data: GAMES,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/games/progress?user_id=1
 * Foydalanuvchining o'yinlar bo'yicha progressi + qaysi o'yinlar ochiq.
 */
const getProgress = async (req, res, next) => {
  try {
    const userId = Number(req.query.user_id);
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    const [rows, unlocked] = await Promise.all([
      GameProgress.findAll({ where: { user_id: userId } }),
      // Ochilgan o'yinlar = bepul o'yinlar + tangaga sotib olinganlar
      require('../models').UserPurchase.findAll({
        where: { user_id: userId, kind: 'game' },
        attributes: ['item_key'],
      }),
    ]);

    const progressMap = Object.fromEntries(rows.map((r) => [r.game_key, r]));
    const unlockedKeys = new Set(unlocked.map((u) => u.item_key));

    const games = GAMES.map((g) => {
      const p = progressMap[g.key];
      const isUnlocked = g.price === 0 || unlockedKeys.has(g.key);
      return {
        ...g,
        unlocked: isUnlocked,
        progress: p
          ? {
              best_score: p.best_score,
              plays: p.plays,
              coins_earned: p.coins_earned,
              stars_earned: p.stars_earned,
              completed_at: p.completed_at,
            }
          : null,
      };
    });

    return res.json({
      success: true,
      data: {
        user_id: userId,
        coins_balance: user.coins_balance,
        stars_count: user.stars_count,
        games,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const starsForScore = (score) => {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
};

/**
 * POST /api/games/complete
 * O'yin natijasini qayd etadi.
 * Birinchi marta min_score ballga yetilganda mukofot BIR MARTA beriladi.
 */
const completeGame = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();

    const { user_id, game_key, score } = req.body;

    const game = GAME_MAP[game_key];
    if (!game) throw new ApiError(404, 'Bunday o\'yin topilmadi');

    const user = await User.findByPk(user_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    // O'yin ochiqmi?
    if (game.price > 0) {
      const purchase = await require('../models').UserPurchase.findOne({
        where: { user_id, item_key: game_key, kind: 'game' },
        transaction: t,
      });
      if (!purchase) {
        throw new ApiError(
          403,
          `"${game.title}" o'yini hali ochilmagan. Do'kondan ${game.price} tanga bilan oching.`
        );
      }
    }

    const now = new Date();
    let progress = await GameProgress.findOne({
      where: { user_id, game_key },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const isNew = !progress;
    const alreadyCompleted = Boolean(progress && progress.completed_at);

    if (progress) {
      progress.plays += 1;
      if (score > progress.best_score) progress.best_score = score;
      progress.last_played_at = now;
    } else {
      progress = GameProgress.build({
        user_id,
        game_key,
        best_score: score,
        plays: 1,
        last_played_at: now,
      });
    }

    let earned_coins = 0;
    let earned_stars = 0;

    if (!alreadyCompleted && score >= game.min_score) {
      earned_coins = game.reward_coins;
      earned_stars = starsForScore(score);
      progress.coins_earned += earned_coins;
      progress.stars_earned += earned_stars;
      progress.completed_at = now;

      user.coins_balance += earned_coins;
      user.stars_count += earned_stars;
      if (score > progress.best_score) progress.best_score = score;

      await user.save({ transaction: t });
    }

    await progress.save({ transaction: t });

    await t.commit();
    t = null;

    return res.json({
      success: true,
      message: alreadyCompleted
        ? "Yaxshi! Bu o'yin bo'yicha mukofot allaqachon berilgan."
        : earned_coins > 0
          ? `Tabriklaymiz! ${earned_coins} tanga oldingiz!`
          : 'Yana urinib ko\'ring!',
      data: {
        game_key,
        score,
        earned_coins,
        earned_stars,
        first_win: !alreadyCompleted && earned_coins > 0,
        replayed: !isNew && alreadyCompleted,
        coins_balance: user.coins_balance,
        stars_count: user.stars_count,
        progress: {
          best_score: progress.best_score,
          plays: progress.plays,
          coins_earned: progress.coins_earned,
          stars_earned: progress.stars_earned,
          completed_at: progress.completed_at,
        },
      },
    });
  } catch (err) {
    if (t) await t.rollback().catch(() => {});
    return next(err);
  }
};

module.exports = { listGames, getProgress, completeGame };
