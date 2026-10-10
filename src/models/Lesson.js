const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const LESSON_CATEGORIES = ['alphabet', 'numbers', 'english', 'stem'];

const Lesson = sequelize.define(
  'Lesson',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Dars sarlavhasi bo'sh bo'lmasligi kerak" },
      },
    },
    category: {
      type: DataTypes.ENUM(...LESSON_CATEGORIES),
      allowNull: false,
      validate: {
        isIn: {
          args: [LESSON_CATEGORIES],
          msg: `Kategoriya quyidagilardan biri bo'lishi kerak: ${LESSON_CATEGORIES.join(', ')}`,
        },
      },
    },
    content_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    rewards_coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: { min: { args: [0], msg: "Mukofot tangalar manfiy bo'lmasligi kerak" } },
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
      defaultValue: 'easy',
    },
  },
  {
    tableName: 'lessons',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ fields: ['category'] }],
  }
);

Lesson.CATEGORIES = LESSON_CATEGORIES;

module.exports = Lesson;
