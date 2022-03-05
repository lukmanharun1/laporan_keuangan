const { param } = require('express-validator');

const find = () => [
  param('emiten_id')
    .notEmpty()
    .isUUID(),
  param('jenis_laporan')
    .notEmpty()
    .isIn(['Q1', 'Q2', 'Q3', 'Q4', 'TAHUNAN'])
];

module.exports = {
  find
}