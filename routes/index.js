const express = require('express')
const router = express.Router();

const emiten = require('./emiten');
const laporanKeuangan = require('./laporan_keuangan');
const neracaKeuangan = require('./neraca_keuangan');
const labaRugi = require('./laba_rugi');

router.use('/laporan-keuangan', laporanKeuangan);
router.use('/emiten', emiten);
router.use('/neraca-keuangan', neracaKeuangan);
router.use('/laba-rugi', labaRugi);
module.exports = router;