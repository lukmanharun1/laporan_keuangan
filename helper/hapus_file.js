const fs = require("fs");
module.exports = (destination) => {
  fs.unlink(destination, (err) => {});
};
