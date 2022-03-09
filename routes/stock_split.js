const express = require('express')
const router = express.Router();

const controller = require('../controller/stock_split');
const validate = require('../middleware/validate');
const validation = require('../validation/stock_split');

router.put('/:emiten_id', validation.update(), validate, controller.update);

module.exports = router;