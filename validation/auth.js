const { body } = require("express-validator");

const register = () => [
  body("nama_lengkap").notEmpty().isString(),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isStrongPassword(),
];

const activation = () => [body("token").notEmpty().isJWT()];

module.exports = {
  register,
  activation,
};
