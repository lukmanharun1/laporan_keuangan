const fs = require("fs");
const path = require("path");

module.exports = (url, namaFile) => {
  let status = true;
  fs.mkdir(path.join(url, namaFile), (err) => {
    if (err) status = false;
  });
  return status;
};
