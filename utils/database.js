const Sequelize = require("sequelize");

const sequelize = new Sequelize("bookswap", "root", "", {
  dialect: "mysql",
  host: "localhost",
  charset: "utf8",
  collate: "utf8_general_ci",
});

module.exports = sequelize;
