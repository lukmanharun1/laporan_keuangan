const express = require("express");
const router = express.Router();

const controller = require("../controller/auth");
const validate = require("../middleware/validate");
const validation = require("../validation/auth");
const { authentication } = require("../middleware/auth");

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
  validation.resetPassword(),
  validate,
  controller.resetPassword
);

router.post("/verify-token", authentication, controller.verifyToken);

module.exports = router;
