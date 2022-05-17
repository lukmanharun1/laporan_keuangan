const fs = require("fs");
const path = require("path");

module.exports = (source) => {
  fs.rmdir(
    path.join(source),
    {
      recursive: true,
    },
    (err) => {}
  );
};
