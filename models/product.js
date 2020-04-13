const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");
const filePath = path.join(rootDir, "data", "products.json");

class Product {
  constructor(title, url, price, description) {
    this.id = Math.random();
    this.title = title;
    this.url = url;
    this.price = price;
    this.description = description;
  }
  save() {
    const readCb = (err, data) => {
      if (err) data = "[]";
      const content = JSON.parse(data.toString() || "[]");
      content.push(this);
      fs.writeFile(filePath, JSON.stringify(content), console.log);
    };
    fs.readFile(filePath, readCb);
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject([]);
        else resolve(JSON.parse(data.toString()));
      });
    });
  }
}

module.exports = Product;
