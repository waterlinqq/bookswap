const fs = require("fs");
exports.deleteFile = (url) => {
  fs.unlink(url, (err) => {
    if (err) throw err;
  });
};
