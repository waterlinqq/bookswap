const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

module.exports = sequelize;
