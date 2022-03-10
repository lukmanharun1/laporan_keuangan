const fs = require('fs');
module.exports = (path) => {
  let status = true;
  fs.readFile(path, (err, data) => {
    if (err) {
      status = false;
    }
  });
  return status;
}