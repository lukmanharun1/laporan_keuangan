const { body, query, param } = require('express-validator');

const getAll = () => [
  query('kode_emiten')
    .optional()
    .isString(),
  query('nama_emiten')
    .optional()
    .isString(),
  query('page')
    .optional()
    .isInt({ min: 1 }),
  query('per_page')
    .optional()
    .isInt({ min: 1 })
];

const create = () => [
  body('jumlah_saham')
    .notEmpty()
    .isInt(),
  body('kode_emiten')
    .notEmpty()
    .custom(require('./validasi_kode_emiten')),
    
  body('nama_emiten')
    .notEmpty()
    .isString({ max: 255 })
];

const update = () => [
  param('id')
    .notEmpty()
    .isUUID(),
  body('jumlah_saham')
    .optional()
    .isInt(),
  body('kode_emiten')
    .optional()
    .custom(require('./validasi_kode_emiten')),
  body('nama_emiten')
    .optional()
    .isString({ max: 255 })
]

module.exports = {
  getAll,
  create,
  update
};