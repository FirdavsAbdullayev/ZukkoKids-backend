const Joi = require('joi');
const { Lesson } = require('../models');

const required = (field) => ({
  'any.required': `${field} kiritish shart`,
  'string.empty': `${field} kiritish shart`,
  'number.base': `${field} raqam bo'lishi kerak`,
});

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required()
    .messages({
      'string.empty': 'Ism kiritish shart',
      'any.required': 'Ism kiritish shart',
      'string.min': "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
      'string.max': 'Ism 60 belgidan oshmasligi kerak',
    }),
  age: Joi.number().integer().min(3).max(12).required()
    .messages({
      'number.base': 'Yosh raqam bo\'lishi kerak',
      'any.required': 'Yosh kiritish shart',
      'number.min': "Yosh kamida 3 bo'lishi kerak",
      'number.max': 'Yosh 12 dan oshmasligi kerak',
    }),
  parent_email: Joi.string().email().required()
    .messages({
      'string.email': "Ota-ona emaili noto'g'ri formatda",
      'string.empty': 'Ota-ona emaili kiritish shart',
      'any.required': 'Ota-ona emaili kiritish shart',
    }),
  avatar_url: Joi.string().trim().max(40).allow('', null).optional(),
});

const completeLessonSchema = Joi.object({
  user_id: Joi.number().integer().positive().required()
    .messages(required('user_id')),
  lesson_id: Joi.number().integer().positive().required()
    .messages(required('lesson_id')),
  score: Joi.number().integer().min(0).max(100).default(100)
    .messages({
      'number.base': "Ball raqam bo'lishi kerak",
      'number.min': "Ball 0 dan kam bo'lmasligi kerak",
      'number.max': 'Ball 100 dan oshmasligi kerak',
    }),
  time_spent_seconds: Joi.number().integer().min(0).default(0)
    .messages({
      'number.base': "Vaqt sonlarda bo'lishi kerak",
      'number.min': "Vaqt manfiy bo'lmasligi kerak",
    }),
});

const purchaseSchema = Joi.object({
  item_key: Joi.string().trim().pattern(/^[a-z0-9_]{2,40}$/).required()
    .messages({
      'string.empty': 'item_key kiritish shart',
      'any.required': 'item_key kiritish shart',
      'string.pattern.base': "item_key faqat kichik harf, raqam va '_' dan iborat bo'lishi kerak",
    }),
});

const gameProgressQuerySchema = Joi.object({
  user_id: Joi.number().integer().positive().required()
    .messages(required('user_id')),
});

const completeGameSchema = Joi.object({
  user_id: Joi.number().integer().positive().required()
    .messages(required('user_id')),
  game_key: Joi.string().trim().pattern(/^[a-z0-9_]{2,40}$/).required()
    .messages({
      'string.empty': 'game_key kiritish shart',
      'any.required': 'game_key kiritish shart',
      'string.pattern.base': "game_key faqat kichik harf, raqam va '_' dan iborat bo'lishi kerak",
    }),
  score: Joi.number().integer().min(0).max(100).required()
    .messages({
      'number.base': "Ball raqam bo'lishi kerak",
      'any.required': 'Ball kiritish shart',
      'number.min': 'Ball 0 dan kam bo\'lmasligi kerak',
      'number.max': 'Ball 100 dan oshmasligi kerak',
    }),
});

const listLessonsQuerySchema = Joi.object({
  category: Joi.string().valid(...Lesson.CATEGORIES).optional()
    .messages({
      'any.only': `Kategoriya quyidagilardan biri bo'lishi kerak: ${Lesson.CATEGORIES.join(', ')}`,
      'string.base': `Kategoriya quyidagilardan biri bo'lishi kerak: ${Lesson.CATEGORIES.join(', ')}`,
    }),
});

// URL'dagi :id parametri butun musbat son bo'lishi shart.
// Aks holda PostgreSQL "invalid input syntax" berib 500 qaytaradi.
const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': "ID raqam bo'lishi kerak",
      'number.positive': "ID musbat son bo'lishi kerak",
      'number.integer': "ID butun son bo'lishi kerak",
      'any.required': 'ID kiritish shart',
    }),
});

module.exports = {
  createUserSchema,
  completeLessonSchema,
  purchaseSchema,
  gameProgressQuerySchema,
  completeGameSchema,
  listLessonsQuerySchema,
  idParamSchema,
};
