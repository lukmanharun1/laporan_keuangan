const { param } = require('express-validator');
const validasiKodeEmiten = require('./validasi_kode_emiten');

const find = () => [
  param('kode_emiten')
    .notEmpty()
    .custom(validasiKodeEmiten),
];

module.exports = {
  find
}