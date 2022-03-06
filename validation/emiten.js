const { body, query } = require('express-validator');

const getAll = () => [
  query('kode_emiten')
    .optional()
    .isString({
      max: 4
    }),
  query('nama_emiten')
    .optional()
    .isString({ max: 255 }),
  query('page')
    .optional()
    .isInt({ min: 1 }),
  query('per_page')
    .optional()
    .isInt({ min: 1 })
]
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
  getAll,
  create
};