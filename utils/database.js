const Sequelize = require("sequelize");

const sequelize = new Sequelize("bookswap", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
