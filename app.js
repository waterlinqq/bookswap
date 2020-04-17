const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Favorite = require("./models/favorite");
const FavoriteItem = require("./models/favorite-item");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", "views");
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/shop", shopRouter);
app.use("/admin", adminRouter);
app.use((req, res, next) => {
  res.render("index");
});

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Favorite);
Favorite.belongsTo(User);
Favorite.belongsToMany(Product, { through: FavoriteItem });
Product.belongsToMany(Favorite, { through: FavoriteItem });
sequelize
  .sync()
  // .sync({ force: true })
  .then(() => User.findByPk(1))
  .then((user) => user || User.create({ name: "Tom", email: "test@test.com" }))
  .then((user) => user.createFavorite())
  .then(() => app.listen(3001))
  .catch(console.log);
