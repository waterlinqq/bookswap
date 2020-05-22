const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Record = sequelize.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  money: Sequelize.FLOAT,
  reason: Sequelize.TEXT,
});

module.exports = Record;
