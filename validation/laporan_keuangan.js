const { body, param, query, } = require('express-validator');

const create = () => [
  body('emiten_id')
    .notEmpty()
    .isUUID(),
  body('tanggal')
    .notEmpty()
    .isDate({ format: 'DD-MM-YYYY' })
    .custom((value) => {
      const [tanggal, bulan] = value.split('-');
      // cek tanggal khusus tanggal 30, 31
      if (tanggal == 31 || tanggal == 30) {
        // cek bulan khusus 3, 6, 9, 12
        if (bulan == 3 || bulan == 6 || bulan == 9 || bulan == 12) {
          return true;
        }
      }
       throw new Error('Tanggal tidak cocok');
    }),
  body('jenis_laporan')
    .notEmpty()
    .isIn(['Q1', 'Q2', 'Q3', 'TAHUNAN']),
  body('harga_saham')
    .notEmpty()
    .isInt()
]

module.exports = {
  create
};