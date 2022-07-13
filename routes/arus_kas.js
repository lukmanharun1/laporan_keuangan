const express = require("express");
const router = express.Router();

const controller = require("../controller/arus_kas");
const validate = require("../middleware/validate");
const { authentication } = require("../middleware/auth");
const validation = require("../validation/arus_kas");

router.get(
  "/:kode_emiten/:jenis_laporan",
  authentication,
  validation.find(),
  validate,
  controller.find
);

module.exports = router;
