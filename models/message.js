const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Message = sequelize.define("message", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  // user: Sequelize.STRING,
  content: Sequelize.TEXT,
});

module.exports = Message;
