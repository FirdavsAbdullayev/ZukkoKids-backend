const { Router } = require('express');
const userRoutes = require('./userRoutes');
const lessonRoutes = require('./lessonRoutes');
const shopRoutes = require('./shopRoutes');
const gameRoutes = require('./gameRoutes');

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🎓 ZukkoKids API xush kelibsiz!',
    version: '1.1.0',
    endpoints: {
      users: '/api/users',
      lessons: '/api/lessons',
      shop: '/api/shop',
      games: '/api/games',
      docs: '/api-docs',
    },
  });
});

router.use('/users', userRoutes);
router.use('/lessons', lessonRoutes);
router.use('/shop', shopRoutes);
router.use('/games', gameRoutes);

module.exports = router;
