const express = require('express')
const router = express.Router();

const controller = require('../controller/dividen');
const validate = require('../middleware/validate');
const validation = require('../validation/dividen');

router.get('/:emiten_id/:jenis_laporan', validation.find(), validate, controller.find);

module.exports = router;