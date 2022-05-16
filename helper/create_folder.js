const fs = require("fs");
const path = require("path");

module.exports = (source, namaFile) => {
  let status = true;
  fs.mkdir(path.join(source, namaFile), (err) => {
    if (err) status = false;
  });
  return status;
};
