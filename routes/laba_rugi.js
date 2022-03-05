const express = require('express')
const router = express.Router();

const controller = require('../controller/laba_rugi');
const validate = require('../middleware/validate');
const validation = require('../validation/laba_rugi');

router.get('/:emiten_id/:jenis_laporan', validation.find(), validate, controller.find);

module.exports = router;