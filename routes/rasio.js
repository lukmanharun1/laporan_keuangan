const express = require("express");
const router = express.Router();

const controller = require("../controller/rasio");
const validate = require("../middleware/validate");
const validation = require("../validation/rasio");

router.get(
  "/:kode_emiten/:jenis_laporan",
  validation.find(),
  validate,
  controller.find
);

module.exports = router;
