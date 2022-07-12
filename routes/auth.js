const express = require("express");
const router = express.Router();

const controller = require("../controller/auth");
const validate = require("../middleware/validate");
const validation = require("../validation/auth");

router.post("/register", validation.register(), validate, controller.register);
router.post(
  "/activation",
  validation.activation(),
  validate,
  controller.activation
);
router.post("/login", validation.login(), validate, controller.login);
router.post(
  "/forgot-password",
  validation.forgotPassword(),
  validate,
  controller.forgotPassword
);
router.post(
  "/reset-password",
  validate.resetPassword(),
  validate,
  controller.resetPassword
);
module.exports = router;
