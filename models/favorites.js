const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/path");
const filePath = path.join(rootDir, "data", "favorites.json");

class Favorite {
  constructor(prodId) {
    this.id = prodId;
  }
  save() {
    const readCb = (err, data) => {
      let content;
      try {
        content = JSON.parse(data.toString());
      } catch {
        content = [];
      }
      const exist = !!content.find((prod) => prod.id == this.id);
      if (!exist) content.push(this);
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
  static delByProdId(id) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        else {
          const favorites = JSON.parse(data.toString());
          const index = favorites.findIndex((p) => p.prodId === id);
          favorites.splice(index, 1);
          fs.writeFile(filePath, JSON.stringify(favorites), console.log);
          resolve(true);
        }
      });
    });
  }
}

module.exports = Favorite;
