const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Suggestion = sequelize.define("suggestion", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    require: true,
  },
  contact: Sequelize.STRING,
  title: {
    type: Sequelize.STRING,
    require: true,
  },
  content: {
    type: Sequelize.TEXT,
    require: true,
  },
});

module.exports = Suggestion;
