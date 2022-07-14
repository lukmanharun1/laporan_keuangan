const express = require("express");
const router = express.Router();

const controller = require("../controller/laporan_keuangan");
const validate = require("../middleware/validate");
const validation = require("../validation/laporan_keuangan");
const uploadFile = require("../middleware/multer");
const rewriteBody = require("../middleware/rewrite_body");
const { authentication, role } = require("../middleware/auth");

router.get(
  "/:kode_emiten/:tanggal",
  authentication,
  validation.find(),
  validate,
  controller.find
);
router.post(
  "/",
  authentication,
  role(["admin"]),
  uploadFile,
  validation.create(),
  validate,
  rewriteBody,
  controller.create
);
router.delete(
  "/:id",
  authentication,
  role(["admin"]),
  validation.destroy(),
  validate,
  controller.destroy
);

module.exports = router;
