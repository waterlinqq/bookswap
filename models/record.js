const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Record = sequelize.define("record", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: Sequelize.FLOAT,
  reason: Sequelize.TEXT,
});

module.exports = Record;
