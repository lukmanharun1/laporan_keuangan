const { param } = require('express-validator');

const find = () => [
  param('emiten_id')
    .notEmpty()
    .isUUID(),
  param('jenis_laporan')
    .notEmpty()
    .isIn(['TAHUNAN'])
];

module.exports = {
  find
}