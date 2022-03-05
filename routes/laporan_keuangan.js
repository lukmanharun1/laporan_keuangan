const express = require('express')
const router = express.Router();

const controller = require('../controller/laporan_keuangan');
const validate = require('../middleware/validate');
const validation = require('../validation/laporan_keuangan');
const uploadFile = require('../middleware/multer');

router.post('/', uploadFile, validation.create(), validate, controller.create);

module.exports = router;