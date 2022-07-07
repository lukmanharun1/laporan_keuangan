const express = require("express");
const router = express.Router();

const controller = require("../controller/auth");
const validate = require("../middleware/validate");
const validation = require("../validation/auth");

router.post("/register", validation.register(), validate, controller.register);
module.exports = router;
