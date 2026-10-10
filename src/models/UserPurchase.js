const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

/**
 * Foydalanuvchi xaridlari (ochilishlar + mukofotlar).
 * (user_id, item_key) juftligi takrorlanmaydi — bir element faqat bir marta sotib olinadi.
 */
const UserPurchase = sequelize.define(
  'UserPurchase',
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
    item_key: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'shop', // 'shop' | 'game'
    },
    price_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: "Sarflangan tanga manfiy bo'lmasligi kerak" } },
    },
  },
  {
    tableName: 'user_purchases',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['user_id', 'item_key'] },
      { fields: ['item_key'] },
    ],
  }
);

module.exports = UserPurchase;
