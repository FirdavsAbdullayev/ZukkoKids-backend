const { Router } = require('express');
const { listGames, getProgress, completeGame } = require('../controllers/gameController');
const { gameProgressQuerySchema, completeGameSchema } = require('../validators/schemas');
const validate = require('../middleware/validate');

const router = Router();

router.get('/', listGames);
router.get('/progress', validate(gameProgressQuerySchema, 'query'), getProgress);
router.post('/complete', validate(completeGameSchema), completeGame);

module.exports = router;
