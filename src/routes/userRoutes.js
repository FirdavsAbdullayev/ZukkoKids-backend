const { Router } = require('express');
const {
  createUser,
  getUserById,
  getUserProgress,
  listUsers,
} = require('../controllers/userController');
const { listPurchases, purchaseItem } = require('../controllers/shopController');
const { createUserSchema, purchaseSchema, idParamSchema } = require('../validators/schemas');
const validate = require('../middleware/validate');

const router = Router();

router.post('/', validate(createUserSchema), createUser);
router.get('/', listUsers);
router.get('/:id', validate(idParamSchema, 'params'), getUserById);
router.get('/:id/progress', validate(idParamSchema, 'params'), getUserProgress);

// Xaridlar (o'yin ochish / mukofotlar)
router.get('/:id/purchases', validate(idParamSchema, 'params'), listPurchases);
router.post(
  '/:id/purchases',
  validate(idParamSchema, 'params'),
  validate(purchaseSchema),
  purchaseItem
);

module.exports = router;
