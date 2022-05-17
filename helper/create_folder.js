const fs = require("fs");
const path = require("path");

module.exports = (source, namaFile) => {
  fs.mkdir(path.join(source, namaFile), () => {});
};
