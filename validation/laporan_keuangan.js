const { body, param } = require('express-validator');
const validasiKodeEmiten = require('./validasi_kode_emiten');
const find = () => [
  param('kode_emiten')
  .notEmpty()
  .custom(validasiKodeEmiten),
  param('tanggal')
  .notEmpty()
  .isDate({ format: 'YYYY-MM-DD' })
  .custom((value) => {
    const [tahun, bulan, tanggal] = value.split('-');
    const validBulanTanggal = {
      '03': '31',
      '06': '30',
      '09': '30',
      '12': '31'
    };
    if (validBulanTanggal[bulan] !== tanggal) {
      throw new Error('Format bulan atau tanggal tidak valid');
    }
    return true;
  })
];

const create = () => [
  // laporan keuangan
  body('emiten_id')
    .notEmpty()
    .isUUID(),
  body('tanggal')
    .notEmpty()
    .isDate({ format: 'YYYY-MM-DD' })
    .custom((value, { req }) => {
      if (!value) {
        throw new Error('tanggal wajib di isi')
      }
      const [tahun, bulan, tanggal] = value.split('-');
      // cek tanggal khusus tanggal 30, 31
      
      // cek bulan khusus 3 -> Q1, 6 -> Q2, 9 -> Q3, 12 -> TAHUNAN
      const { jenis_laporan } = req.body;
      if (tanggal == 31 && bulan == 3 && jenis_laporan == 'Q1' ||
          tanggal == 30 && bulan == 6 && jenis_laporan == 'Q2' ||
          tanggal == 30 && bulan == 9 && jenis_laporan == 'Q3' ||
          tanggal == 31 && bulan == 12 && jenis_laporan == 'TAHUNAN') {
        return true;
      }
      throw new Error('Tanggal tidak cocok dengan jenis laporan');
    }),
  body('jenis_laporan')
    .notEmpty()
    .isIn(['Q1', 'Q2', 'Q3', 'TAHUNAN']),
  body('harga_saham')
    .notEmpty()
    .isInt(),

  // neraca keuangan
  body('aset')
    .notEmpty()
    .isInt(),
  body('kas_dan_setara_kas')
    .notEmpty()
    .isInt(),
  body('piutang')
    .notEmpty()
    .isInt(),
  body('persediaan')
    .notEmpty()
    .isInt(),
  body('aset_lancar')
    .notEmpty()
    .isInt(),
  body('aset_tidak_lancar')
    .notEmpty()
    .isInt(),
  body('liabilitas_jangka_pendek')
    .notEmpty()
    .isInt(),
  body('liabilitas_jangka_panjang')
    .notEmpty()
    .isInt(),
  body('liabilitas_berbunga')
    .notEmpty()
    .isInt(),
  body('ekuitas')
    .notEmpty()
    .isInt(),

  // laba rugi
  
  body('pendapatan')
    .notEmpty()
    .isInt(),
  body('laba_kotor')
    .notEmpty()
    .isInt(),
  body('laba_usaha')
    .notEmpty()
    .isInt(),
  body('laba_sebelum_pajak')
    .notEmpty()
    .isInt(),
  body('laba_bersih')
    .notEmpty()
    .isInt(),
  
  // arus kas
  
  body('operasi')
    .notEmpty()
    .isInt(),
  body('investasi')
    .notEmpty()
    .isInt(),
  body('pendanaan')
    .notEmpty()
    .isInt(),
  
  // dividen
  body('cash')
    .optional()
    .isInt()
  
];

const destroy = () => [
  param('id')
    .notEmpty()
    .isUUID()
];

module.exports = {
  find,
  create,
  destroy
};