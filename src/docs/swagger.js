const swaggerUi = require('swagger-ui-express');

const ID_PARAM = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  example: 1,
};

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ZukkoKids API',
    version: '1.0.0',
    description:
      "Bolalar uchun ta'lim-gamifikatsiya platformasi API hujjatlari. " +
      "Foydalanuvchi (bola) profillari, darslar va progressni boshqaradi.",
    contact: { name: 'ZukkoKids Team' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Lokal server' },
  ],
  tags: [
    { name: 'Users', description: 'Bolalar profillari' },
    { name: 'Lessons', description: "Darslar va ularni tugatish" },
    { name: 'Shop', description: "Do'kon katalogi va xaridlar" },
    { name: 'Games', description: "O'yinlar katalogi, progress va mukofotlar" },
  ],
  paths: {
    '/api/users': {
      post: {
        tags: ['Users'],
        summary: 'Yangi bola profili yaratish',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'age', 'parent_email'],
                properties: {
                  name: { type: 'string', example: 'Aziza' },
                  age: { type: 'integer', example: 6 },
                  parent_email: { type: 'string', format: 'email', example: 'parent@example.com' },
                  avatar_url: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Profil muvaffaqiyatli yaratildi' },
          400: { description: "Validatsiya xatosi" },
        },
      },
      get: {
        tags: ['Users'],
        summary: 'Barcha foydalanuvchilarni olish',
        responses: {
          200: { description: 'Foydalanuvchilar ro\'yxati' },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Bitta foydalanuvchini olish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'Foydalanuvchi ma\'lumotlari' },
          400: { description: "ID noto'g'ri formatda" },
          404: { description: 'Foydalanuvchi topilmadi' },
        },
      },
    },
    '/api/users/{id}/progress': {
      get: {
        tags: ['Users'],
        summary: "Bolaning progressi (tangalar, yulduzlar, darslar)",
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'Progress ma\'lumotlari' },
          404: { description: 'Foydalanuvchi topilmadi' },
        },
      },
    },
    '/api/users/{id}/purchases': {
      get: {
        tags: ['Shop'],
        summary: "Foydalanuvchi sotib olgan (ochgan) elementlar",
        parameters: [ID_PARAM],
        responses: {
          200: { description: "Xaridlar ro'yxati" },
          404: { description: 'Foydalanuvchi topilmadi' },
        },
      },
      post: {
        tags: ['Shop'],
        summary: 'Elementni tangaga sotib olish (ochish)',
        parameters: [ID_PARAM],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['item_key'],
                properties: {
                  item_key: { type: 'string', example: 'maze' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Xarid muvaffaqiyatli' },
          400: { description: 'Tangalar yetarli emas' },
          404: { description: 'Foydalanuvchi yoki buyum topilmadi' },
          409: { description: 'Element allaqachon sotib olingan' },
        },
      },
    },
    '/api/shop': {
      get: {
        tags: ['Shop'],
        summary: "Do'kon katalogi (mukofotlar, ochilishlar, o'yinlar)",
        responses: {
          200: { description: 'Katalog roʻyxati' },
        },
      },
    },
    '/api/games': {
      get: {
        tags: ['Games'],
        summary: "O'yinlar katalogi (kalit, nom, narx, mukofot)",
        responses: {
          200: { description: "O'yinlar ro'yxati" },
        },
      },
    },
    '/api/games/progress': {
      get: {
        tags: ['Games'],
        summary: "Foydalanuvchi o'yin progressi va ochiq o'yinlar",
        parameters: [
          {
            name: 'user_id',
            in: 'query',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            example: 1,
          },
        ],
        responses: {
          200: { description: "Progress ma'lumotlari" },
          400: { description: "user_id noto'g'ri" },
          404: { description: 'Foydalanuvchi topilmadi' },
        },
      },
    },
    '/api/games/complete': {
      post: {
        tags: ['Games'],
        summary: "O'yin natijasini qayd etish (birinchi marta mukofot beriladi)",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_id', 'game_key', 'score'],
                properties: {
                  user_id: { type: 'integer', example: 1 },
                  game_key: { type: 'string', example: 'memory' },
                  score: { type: 'integer', minimum: 0, maximum: 100, example: 85 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Natija qayd etildi' },
          400: { description: "Validatsiya xatosi" },
          403: { description: "O'yin hali ochilmagan" },
          404: { description: 'Foydalanuvchi yoki o\'yin topilmadi' },
        },
      },
    },
    '/api/lessons': {
      get: {
        tags: ['Lessons'],
        summary: 'Darslar ro\'yxati (kategoriya bo\'yicha filter)',
        parameters: [
          {
            name: 'category',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['alphabet', 'numbers', 'english', 'stem'],
            },
            example: 'alphabet',
          },
        ],
        responses: {
          200: { description: "Darslar ro'yxati" },
          400: { description: 'Noto\'g\'ri kategoriya' },
        },
      },
    },
    '/api/lessons/{id}': {
      get: {
        tags: ['Lessons'],
        summary: 'Bitta darsni olish',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            example: 1,
          },
        ],
        responses: {
          200: { description: 'Dars ma\'lumotlari' },
          400: { description: "ID noto'g'ri formatda" },
          404: { description: 'Dars topilmadi' },
        },
      },
    },
    '/api/lessons/complete': {
      post: {
        tags: ['Lessons'],
        summary: 'Darsni tugatish (tangalar hisoblanadi)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_id', 'lesson_id'],
                properties: {
                  user_id: { type: 'integer', example: 1 },
                  lesson_id: { type: 'integer', example: 1 },
                  score: { type: 'integer', minimum: 0, maximum: 100, example: 95 },
                  time_spent_seconds: { type: 'integer', example: 120 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Dars tugatildi, mukofot berildi' },
          200: { description: 'Dars avval tugatilgan (mukofot yo\'q)' },
          404: { description: 'Foydalanuvchi yoki dars topilmadi' },
        },
      },
    },
  },
};

const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ZukkoKids API Docs',
};

module.exports = { swaggerSpec, swaggerOptions, swaggerUi };
