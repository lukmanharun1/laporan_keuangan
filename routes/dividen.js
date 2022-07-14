const express = require("express");
const router = express.Router();

const controller = require("../controller/dividen");
const validate = require("../middleware/validate");
const { authentication } = require("../middleware/auth");
const validation = require("../validation/dividen");

router.get(
  "/:kode_emiten",
  authentication,
  validation.find(),
  validate,
  controller.find
);

module.exports = router;
