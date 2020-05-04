require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require("connect-flash");
const csurf = require("csurf");
const multer = require("multer");

const sequelize = require("./utils/database");
const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const errorRouter = require("./routes/error");
const Product = require("./models/product");
const User = require("./models/user");
const Favorite = require("./models/favorite");
const FavoriteItem = require("./models/favorite-item");
const Message = require("./models/message");
const getUser = require("./middleware/user");
const getToken = require("./middleware/token");
const getDefault = require("./middleware/default");

const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.random()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage, fileFilter }).array("images"));
app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
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
app.use(getDefault);
app.use("/shop", shopRouter);
app.use("/admin", adminRouter);
app.use(authRouter);

app.get("/", (req, res, next) => {
  res.render("index", { user: req.user });
});
app.use(errorRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error/500");
});

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Favorite);
Favorite.belongsTo(User);
Favorite.belongsToMany(Product, { through: FavoriteItem });
Product.belongsToMany(Favorite, { through: FavoriteItem });
Message.belongsTo(Product);
Product.hasMany(Message);
sequelize
  .sync()
  // .sync({ force: true })
  // .then(() => User.findByPk(1))
  // .then((user) => user || User.create({ name: "Tom", email: "test@test.com" }))
  // .then((user) => user.createFavorite())
  .then(() => app.listen(3001))
  .catch(console.log);
