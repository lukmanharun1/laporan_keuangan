const { param, body } = require('express-validator');

const update = () => [
  param('emiten_id')
    .notEmpty()
    .isUUID(),
  body('jumlah_saham')
    .notEmpty()
    .isInt(),
  body('aksi')
    .notEmpty()
    .isIn(['stock_split', 'reverse_stock_split']),
  body('split')
    .notEmpty()
    .isInt({ min: 2, max: 20 }),
];

module.exports = {
  update
}