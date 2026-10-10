const sequelize = require('../config/sequelize');
const User = require('./User');
const Lesson = require('./Lesson');
const UserProgress = require('./UserProgress');
const UserPurchase = require('./UserPurchase');
const GameProgress = require('./GameProgress');

// ---- Associations ----

// User <-> Lesson  (ko'p-ko'pga) orqali UserProgress
User.belongsToMany(Lesson, {
  through: UserProgress,
  foreignKey: 'user_id',
  otherKey: 'lesson_id',
  as: 'lessons',
});

Lesson.belongsToMany(User, {
  through: UserProgress,
  foreignKey: 'lesson_id',
  otherKey: 'user_id',
  as: 'users',
});

// User hasMany UserProgress
User.hasMany(UserProgress, {
  foreignKey: 'user_id',
  as: 'progress',
  onDelete: 'CASCADE',
});

UserProgress.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Lesson hasMany UserProgress
Lesson.hasMany(UserProgress, {
  foreignKey: 'lesson_id',
  as: 'progress',
  onDelete: 'CASCADE',
});

UserProgress.belongsTo(Lesson, {
  foreignKey: 'lesson_id',
  as: 'lesson',
});

// ---- Xaridlar (do'kon + o'yin ochilishlari) ----
User.hasMany(UserPurchase, {
  foreignKey: 'user_id',
  as: 'purchases',
  onDelete: 'CASCADE',
});

UserPurchase.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// ---- O'yin progressi ----
User.hasMany(GameProgress, {
  foreignKey: 'user_id',
  as: 'gameProgress',
  onDelete: 'CASCADE',
});

GameProgress.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

const db = {
  sequelize,
  User,
  Lesson,
  UserProgress,
  UserPurchase,
  GameProgress,
};

module.exports = db;
