const { body } = require("express-validator");

const register = () => [
  body("nama_lengkap").notEmpty().isString(),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isStrongPassword(),
];

module.exports = {
  register,
};
