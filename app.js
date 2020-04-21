require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require("connect-flash");
const csurf = require("csurf");

const sequelize = require("./utils/database");
const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const errorRouter = require("./routes/error");
const Product = require("./models/product");
const User = require("./models/user");
const Favorite = require("./models/favorite");
const FavoriteItem = require("./models/favorite-item");
const getUser = require("./middleware/user");
const getToken = require("./middleware/token");

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
app.use(flash());
app.use(csurf());

app.use(getUser);
app.use(getToken);
app.use("/shop", shopRouter);
app.use("/admin", adminRouter);
app.use(authRouter);

app.get("/", (req, res, next) => {
  res.render("index", { user: req.user });
});
app.use(errorRouter);

app.use((error, req, res, next) => {
  res.status(500).render("error/500");
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
  // .then(() => User.findByPk(1))
  // .then((user) => user || User.create({ name: "Tom", email: "test@test.com" }))
  // .then((user) => user.createFavorite())
  .then(() => app.listen(3001))
  .catch(console.log);
