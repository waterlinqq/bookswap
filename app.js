const path = require("path");

const express = require("express");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use((req, res, next) => {
  res.render("index");
});
app.listen(3001);
