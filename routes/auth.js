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

module.exports = router;
