const { Router } = require('express');
const { listShop } = require('../controllers/shopController');

const router = Router();

router.get('/', listShop);

module.exports = router;
