const express = require('express')
const router = express.Router();

const controller = require('../controller/emiten');
const validate = require('../middleware/validate');
const validation = require('../validation/emiten');

router.post('/', validation.create(), validate, controller.create);

module.exports = router;