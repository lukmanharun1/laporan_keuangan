const { param } = require('express-validator');
const validasiKodeEmiten = require('./validasi_kode_emiten');

const find = () => [
  param('kode_emiten')
    .notEmpty()
    .custom(validasiKodeEmiten),
  param('jenis_laporan')
    .notEmpty()
    .isIn(['Q1', 'Q2', 'Q3', 'Q4', 'TAHUNAN'])
];

module.exports = {
  find
}