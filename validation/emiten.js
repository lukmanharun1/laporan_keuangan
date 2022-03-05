const { body } = require('express-validator');

const create = () => [
  body('jumlah_saham')
    .notEmpty()
    .isInt(),
  body('kode_emiten')
    .notEmpty()
    .isString({
      min: 4,
      max: 4
    }),
  body('nama_emiten')
    .notEmpty()
    .isString({ max: 255 })
]

module.exports = {
  create
};