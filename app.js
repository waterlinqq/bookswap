const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sequelize = require("./utils/database");
const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");
const authRoutes = require("./routes/auth");
const Product = require("./models/product");
const User = require("./models/user");
const Favorite = require("./models/favorite");
const FavoriteItem = require("./models/favorite-item");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", "views");
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  const user = await User.findByPk(req.session.user.id);

  req.user = user;
  next();
});

app.use("/shop", shopRouter);
app.use("/admin", adminRouter);
app.use(authRoutes);

app.use((req, res, next) => {
  res.render("index", { user: req.user });
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
  // .then((user) => user || User.create({ name: "Tom", email: "test@test.com" }))
  // .then((user) => user.createFavorite())
  .then(() => app.listen(3001))
  .catch(console.log);
