const fs = require("fs");
const path = require("path");

module.exports = (source) => {
  let status = true;
  fs.rmdir(path.join(source), (err) => {
    if (err) status = false;
  });
  return status;
};
