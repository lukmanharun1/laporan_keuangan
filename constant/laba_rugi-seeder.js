const laporanKeuangan = require('./laporan_keuangan-seeder');
module.exports = [
  {
    "id": laporanKeuangan[0].id,
    "pendapatan": 1500000000000,
    "laba_kotor": 500000000000,
    "laba_usaha": 300000000000,
    "laba_sebelum_pajak": 200000000000,
    "laba_bersih": 150000000000
  }
]