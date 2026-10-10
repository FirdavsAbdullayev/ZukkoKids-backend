const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

/**
 * O'yin bo'yicha progress: eng yaxshi ball, o'yinlar soni va
 * birinchi marta g'alaba qozonilgan vaqt (mukofot shu yerda qayd etiladi).
 */
const GameProgress = sequelize.define(
  'GameProgress',
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
    game_key: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    best_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    plays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    coins_earned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stars_earned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    last_played_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'game_progress',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['user_id', 'game_key'] },
      { fields: ['game_key'] },
    ],
  }
);

module.exports = GameProgress;
