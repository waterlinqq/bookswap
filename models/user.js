const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  resetToken: Sequelize.STRING,
  resetTokenExpiration: Sequelize.DATE,
  username: Sequelize.STRING,
  city: Sequelize.STRING,
  description: Sequelize.STRING,
  delivery: {
    type: Sequelize.STRING,
    defaultValue: "[]",
  },
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  money: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
});

module.exports = User;
