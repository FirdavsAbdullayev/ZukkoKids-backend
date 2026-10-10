const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Ism bo\'sh bo\'lmasligi kerak' },
        len: { args: [2, 60], msg: 'Ism 2-60 belgi orasida bo\'lishi kerak' },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 3, msg: 'Yosh kamida 3 bo\'lishi kerak' },
        max: { args: 12, msg: 'Yosh 12 dan oshmasligi kerak' },
      },
    },
    parent_email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        isEmail: { msg: "Ota-ona emaili noto'g'ri formatda" },
      },
    },
    coins_balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stars_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ fields: ['parent_email'] }],
  }
);

module.exports = User;
