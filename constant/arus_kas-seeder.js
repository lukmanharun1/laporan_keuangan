const laporanKeuangan = require('./laporan_keuangan-seeder');
module.exports = [
  {
    "id": laporanKeuangan[0].id,
    "operasi": 400000000000,
    "investasi": -100000000000,
    "pendanaan": -150000000000
  }
]