const { body, header } = require("express-validator");

const register = () => [
  body("nama_lengkap").isString().isLength({ min: 3, max: 128 }),
  body("email").isEmail(),
  body("password").isStrongPassword(),
];

const login = () => [
  body("email").isEmail(),
  body("password").isStrongPassword(),
];

const activation = () => [header("Authorization").isJWT()];

const forgotPassword = () => [body("email").isEmail()];

const resetPassword = () => [
  header("Authorization").isJWT(),
  body("new_password").isStrongPassword(),
];

module.exports = {
  register,
  activation,
  login,
  forgotPassword,
  resetPassword,
};
