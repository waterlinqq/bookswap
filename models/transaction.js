const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Transaction = sequelize.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  productId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    defaultValue: "0",
  },
  buyerId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sellerId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  place: Sequelize.STRING,
  delivery: Sequelize.STRING,
  time: Sequelize.STRING,
  mark: Sequelize.STRING,
});

module.exports = Transaction;
