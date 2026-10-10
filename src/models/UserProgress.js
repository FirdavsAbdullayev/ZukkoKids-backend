const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UserProgress = sequelize.define(
  'UserProgress',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'lessons', key: 'id' },
      onDelete: 'CASCADE',
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "Ball manfiy bo'lmasligi kerak" },
        max: { args: [100], msg: "Ball 100 dan oshmasligi kerak" },
      },
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    time_spent_seconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'user_progress',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['user_id', 'lesson_id'] },
    ],
  }
);

module.exports = UserProgress;
