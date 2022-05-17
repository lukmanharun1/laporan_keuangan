const fs = require("fs");
module.exports = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err) => {
      if (err) {
        reject(false);
      }
      resolve(true);
    });
  });
};
