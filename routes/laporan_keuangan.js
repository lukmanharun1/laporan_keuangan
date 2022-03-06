const express = require('express')
const router = express.Router();

const controller = require('../controller/laporan_keuangan');
const validate = require('../middleware/validate');
const validation = require('../validation/laporan_keuangan');
const uploadFile = require('../middleware/multer');

router.post('/', uploadFile, validation.create(), validate, controller.create);
router.delete('/:id', validation.destroy(), validate, controller.destroy);

module.exports = router;