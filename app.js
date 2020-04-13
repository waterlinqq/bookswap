const path = require("path");

const express = require("express");

const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use("/shop", shopRouter);
app.use((req, res, next) => {
  res.render("index");
});
app.listen(3001);
