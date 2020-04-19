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
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
