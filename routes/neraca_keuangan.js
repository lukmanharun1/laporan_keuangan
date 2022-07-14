const express = require("express");
const router = express.Router();

const controller = require("../controller/neraca_keuangan");
const validate = require("../middleware/validate");
const { authentication } = require("../middleware/auth");
const validation = require("../validation/neraca_keuangan");

router.get(
  "/:kode_emiten/:jenis_laporan",
  authentication,
  validation.find(),
  validate,
  controller.find
);

module.exports = router;
