const express = require('express')
const router = express.Router();

const controller = require('../controller/neraca_keuangan');
const validate = require('../middleware/validate');
const validation = require('../validation/neraca_keuangan');

router.get('/:emiten_id/:jenis_laporan', validation.find(), validate, controller.find);

module.exports = router;