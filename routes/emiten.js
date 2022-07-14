const express = require("express");
const router = express.Router();

const controller = require("../controller/emiten");
const validate = require("../middleware/validate");
const { authentication, role } = require("../middleware/auth");

const validation = require("../validation/emiten");

router.get(
  "/",
  authentication,
  validation.getAll(),
  validate,
  controller.getAll
);
router.post(
  "/",
  authentication,
  role(["admin"]),
  validation.create(),
  validate,
  controller.create
);
router.put(
  "/:id",
  authentication,
  role(["admin"]),
  validation.create(),
  validation.update(),
  validate,
  controller.update
);

module.exports = router;
