const express = require('express')
const router = express.Router();

const emiten = require('./emiten');
const laporanKeuangan = require('./laporan_keuangan');
const neracaKeuangan = require('./neraca_keuangan');

router.use('/laporan-keuangan', laporanKeuangan);
router.use('/emiten', emiten);
router.use('/neraca-keuangan', neracaKeuangan);
module.exports = router;