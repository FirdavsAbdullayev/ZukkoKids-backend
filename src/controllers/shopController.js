const { User, UserPurchase, sequelize } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { getShopCatalog, findCatalogItem, GAME_MAP } = require('../config/catalog');

/**
 * GET /api/shop
 * Do'kon katalogi: mukofotlar, ochilishlar va barcha o'yinlar (narx bilan).
 */
const listShop = async (_req, res, next) => {
  try {
    return res.json({
      success: true,
      count: getShopCatalog().length,
      data: getShopCatalog(),
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/users/:id/purchases
 * Foydalanuvchi sotib olgan (ochgan) elementlar ro'yxati.
 */
const listPurchases = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    const purchases = await UserPurchase.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    return res.json({
      success: true,
      data: {
        user_id: userId,
        coins_balance: user.coins_balance,
        item_keys: purchases.map((p) => p.item_key),
        purchases,
      },
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/users/:id/purchases
 * Elementni tangaga sotib olish (ochish).
 * Narx SERVER katalogidan olinadi — client kiritgan narx e'tiborga olinmaydi.
 */
const purchaseItem = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();

    const userId = Number(req.params.id);
    const { item_key } = req.body;

    const catalogItem = findCatalogItem(item_key);
    if (!catalogItem) throw new ApiError(404, "Bunday buyum do'konda yo'q");

    const user = await User.findByPk(userId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new ApiError(404, 'Foydalanuvchi topilmadi');

    const existing = await UserPurchase.findOne({
      where: { user_id: userId, item_key },
      transaction: t,
    });
    if (existing) {
      await t.rollback();
      t = null;
      return res.status(409).json({
        success: false,
        already_owned: true,
        message: `"${catalogItem.title}" allaqachon sotib olingan`,
        data: {
          coins_balance: user.coins_balance,
          stars_count: user.stars_count,
          item_key,
        },
      });
    }

    if (user.coins_balance < catalogItem.price) {
      throw new ApiError(
        400,
        `Tangalar yetarli emas! "${catalogItem.title}" uchun ${catalogItem.price} tanga kerak.`
      );
    }

    const isGame = Boolean(GAME_MAP[item_key]);

    user.coins_balance -= catalogItem.price;
    await user.save({ transaction: t });

    const purchase = await UserPurchase.create(
      {
        user_id: userId,
        item_key,
        kind: isGame ? 'game' : 'shop',
        price_paid: catalogItem.price,
      },
      { transaction: t }
    );

    await t.commit();
    t = null;

    return res.status(201).json({
      success: true,
      message: `"${catalogItem.title}" ochildingiz! ${catalogItem.price} tanga sarflandi.`,
      data: {
        item_key,
        kind: purchase.kind,
        price_paid: catalogItem.price,
        coins_balance: user.coins_balance,
        stars_count: user.stars_count,
      },
    });
  } catch (err) {
    if (t) await t.rollback().catch(() => {});
    return next(err);
  }
};

module.exports = { listShop, listPurchases, purchaseItem };
