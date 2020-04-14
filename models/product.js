const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");
const filePath = path.join(rootDir, "data", "products.json");

class Product {
  constructor(title, url, price, description) {
    this.id = Math.random().toString();
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
  static getById(id) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(null);
        else {
          const products = JSON.parse(data.toString());
          const product = products.find((p) => p.id === id);
          resolve(product);
        }
      });
    });
  }
  static modById(id, props) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(null);
        else {
          const products = JSON.parse(data.toString());
          const product = products.find((p) => p.id === id);
          Object.assign(product, props);
          fs.writeFile(filePath, JSON.stringify(products), console.log);
          resolve(product);
        }
      });
    });
  }
}

module.exports = Product;
