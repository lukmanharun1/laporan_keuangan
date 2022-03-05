const express = require('express')
const router = express.Router();

const emiten = require('./emiten');
const laporanKeuangan = require('./laporan_keuangan');

router.use('/laporan-keuangan', laporanKeuangan);
router.use('/emiten', emiten);
module.exports = router;