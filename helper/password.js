const bcrypt = require("bcrypt");

const saltRounds = 10;
const passwordHash = (password) => bcrypt.hash(password, saltRounds);

const verifyPassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);

module.exports = {
  passwordHash,
  verifyPassword,
};
