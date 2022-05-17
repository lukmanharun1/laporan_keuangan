const fs = require("fs");
const path = require("path");

module.exports = (source) => {
  return new Promise((resolve, reject) => {
    fs.rmdir(
      path.join(source),
      {
        recursive: true,
      },
      (err) => {
        if (err) reject(false);
        resolve(true);
      }
    );
  });
};
