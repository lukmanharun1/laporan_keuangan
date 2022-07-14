const express = require("express");
const router = express.Router();

const controller = require("../controller/laba_rugi");
const validate = require("../middleware/validate");
const { authentication } = require("../middleware/auth");
const validation = require("../validation/laba_rugi");

router.get(
  "/:kode_emiten/:jenis_laporan",
  authentication,
  validation.find(),
  validate,
  controller.find
);

module.exports = router;
