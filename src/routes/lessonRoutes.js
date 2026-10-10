const { Router } = require('express');
const { listLessons, getLessonById, completeLesson } = require('../controllers/lessonController');
const { completeLessonSchema, listLessonsQuerySchema, idParamSchema } = require('../validators/schemas');
const validate = require('../middleware/validate');

const router = Router();

router.get('/', validate(listLessonsQuerySchema, 'query'), listLessons);
router.post('/complete', validate(completeLessonSchema), completeLesson);
router.get('/:id', validate(idParamSchema, 'params'), getLessonById);

module.exports = router;
