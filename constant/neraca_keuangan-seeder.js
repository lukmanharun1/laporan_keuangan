const laporanKeuangan = require('./laporan_keuangan-seeder');

module.exports = [
  {
    "id": laporanKeuangan[0].id,
    "aset": 1000000000000,
    "kas_dan_setara_kas": 1000000000,
    "piutang": 2000000000,
    "persediaan": 1000000000,
    "aset_lancar": 600000000000,
    "aset_tidak_lancar": 400000000000,
    "liabilitas_jangka_pendek": 100000000000,
    "liabilitas_jangka_panjang": 1000000000,
    "liabilitas_berbunga": 2000000000,
    "ekuitas": 600000000000
  }
]