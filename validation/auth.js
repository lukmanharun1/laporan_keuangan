const { body } = require("express-validator");

const register = () => [
  body("nama_lengkap").notEmpty().isString().isLength({ min: 3, max: 128 }),
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isStrongPassword(),
];

const login = () => [
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isStrongPassword(),
];

const activation = () => [body("token").notEmpty().isJWT()];

const forgotPassword = () => [body("email").notEmpty().isEmail()];

const resetPassword = () => [
  body("token").notEmpty().isJWT(),
  body("new_password").notEmpty().isStrongPassword(),
];

module.exports = {
  register,
  activation,
  login,
  forgotPassword,
  resetPassword,
};
