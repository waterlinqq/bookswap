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
const transactionRouter = require("./routes/transaction");
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/user");
const Product = require("./models/product");
const User = require("./models/user");
const Favorite = require("./models/favorite");
const FavoriteItem = require("./models/favorite-item");
const Message = require("./models/message");
const Transaction = require("./models/transaction");
const Chat = require("./models/chat");
const getUser = require("./middleware/user");
const getToken = require("./middleware/token");
const getDefault = require("./middleware/default");
const socket = require("./socket");

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
app.use("/transaction", transactionRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);
app.use(authRouter);

app.get("/", (req, res, next) => {
  res.render("index", { user: req.user });
});
app.use(errorRouter);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error/500");
});
// step 1
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Favorite);
User.hasMany(Message);
Message.belongsTo(User);
Favorite.belongsTo(User);
Favorite.belongsToMany(Product, { through: FavoriteItem });
Product.belongsToMany(Favorite, { through: FavoriteItem });
Message.belongsTo(Product);
Product.hasMany(Message);
// step 2
Transaction.belongsTo(User, { as: "buyer", foreignKey: "buyerId" });
Transaction.belongsTo(User, { as: "seller", foreignKey: "sellerId" });
Transaction.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Transaction, { as: "buy", foreignKey: "buyerId" });
User.hasMany(Transaction, { as: "sell", foreignKey: "sellerId" });

User.hasMany(Chat, { as: "send", foreignKey: "from" });
User.hasMany(Chat, { as: "recieve", foreignKey: "to" });

Chat.belongsTo(User, { as: "sendBy", foreignKey: "from" });
Chat.belongsTo(User, { as: "recievedBy", foreignKey: "to" });

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => app.listen(3001))
  .then(socket.init)
  .catch(console.log);
