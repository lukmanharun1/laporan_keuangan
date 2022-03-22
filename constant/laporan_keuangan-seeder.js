const emiten = require('./emiten_seeder');
const id1 = "95e28076-d415-41c1-9e5c-d1449740018e";
const id2 = "95e28076-d415-41c1-9e5c-d1449740018f";
const id3 = "95e28076-d415-41c1-9e5c-d1449740018g";
const id4 = "95e28076-d415-41c1-9e5c-d1449740018h";
module.exports = {
  laporan_keuangan: [
    {
      id: id1,
      emiten_id: emiten[0].id,
      tanggal: "2022-03-31",
      jenis_laporan: "Q1",
      harga_saham: 11000,
      nama_file: "AALI Q1 31 MARET 2022.pdf"
    },
    {
      id: id2,
      emiten_id: emiten[0].id,
      tanggal: "2022-06-30",
      jenis_laporan: "Q2",
      harga_saham: 12000,
      nama_file: "AALI Q2 30 JUNI 2022.pdf"
    },
    {
      id: id3,
      emiten_id: emiten[0].id,
      tanggal: "2022-09-30",
      jenis_laporan: "Q3",
      harga_saham: 11000,
      nama_file: "AALI Q3 30 SEPTEMBER 2022.pdf"
    },
    {
      id: id4,
      emiten_id: emiten[0].id,
      tanggal: "2022-12-31",
      jenis_laporan: "TAHUNAN",
      harga_saham: 13000,
      nama_file: "AALI TAHUNAN 31 DESEMBER 2022.pdf"
    },
  ],
  neraca_keuangan: [
    {
      id: id1,
      aset: 1000000000000,
      kas_dan_setara_kas: 1000000000,
      piutang: 2000000000,
      persediaan: 1000000000,
      aset_lancar: 600000000000,
      aset_tidak_lancar: 400000000000,
      liabilitas_jangka_pendek: 100000000000,
      liabilitas_jangka_panjang: 1000000000,
      liabilitas_berbunga: 2000000000,
      ekuitas: 600000000000
    },
    {
      id: id2,
      aset: 1100000000000,
      kas_dan_setara_kas: 1000000000,
      piutang: 2000000000,
      persediaan: 1000000000,
      aset_lancar: 620000000000,
      aset_tidak_lancar: 400000000000,
      liabilitas_jangka_pendek: 100000000000,
      liabilitas_jangka_panjang: 1000000000,
      liabilitas_berbunga: 2000000000,
      ekuitas: 650000000000
    },
    {
      id: id3,
      aset: 1300000000000,
      kas_dan_setara_kas: 1000000000,
      piutang: 2000000000,
      persediaan: 1000000000,
      aset_lancar: 620000000000,
      aset_tidak_lancar: 400000000000,
      liabilitas_jangka_pendek: 100000000000,
      liabilitas_jangka_panjang: 1000000000,
      liabilitas_berbunga: 2000000000,
      ekuitas: 750000000000
    },
    {
      id: id4,
      aset: 1400000000000,
      kas_dan_setara_kas: 1000000000,
      piutang: 2000000000,
      persediaan: 1000000000,
      aset_lancar: 620000000000,
      aset_tidak_lancar: 400000000000,
      liabilitas_jangka_pendek: 100000000000,
      liabilitas_jangka_panjang: 1000000000,
      liabilitas_berbunga: 2000000000,
      ekuitas: 80000000000
    }
  ],
  laba_rugi: [
    {
      id: id1,
      pendapatan: 1500000000000,
      laba_kotor: 500000000000,
      laba_usaha: 300000000000,
      laba_sebelum_pajak: 200000000000,
      laba_bersih: 150000000000
    },
    {
      id: id2,
      pendapatan: 1600000000000,
      laba_kotor: 510000000000,
      laba_usaha: 400000000000,
      laba_sebelum_pajak: 300000000000,
      laba_bersih: 20000000000
    },
    {
      id: id3,
      pendapatan: 1600000000000,
      laba_kotor: 510000000000,
      laba_usaha: 400000000000,
      laba_sebelum_pajak: 300000000000,
      laba_bersih: 20000000000
    },
    {
      id: id4,
      pendapatan: 1400000000000,
      laba_kotor: 500000000000,
      laba_usaha: 360000000000,
      laba_sebelum_pajak: 220000000000,
      laba_bersih: 18000000000
    }
  ],
  arus_kas: [
    {
      id: id1,
      operasi: 400000000000,
      investasi: -100000000000,
      pendanaan: -150000000000
    },
    {
      id: id2,
      operasi: 350000000000,
      investasi: -50000000000,
      pendanaan: -100000000000
    },
    {
      id: id3,
      operasi: 340000000000,
      investasi: -40000000000,
      pendanaan: -20000000000
    },
    {
      id: id4,
      operasi: 250000000000,
      investasi: -50000000000,
      pendanaan: -20000000000
    }
  ],
  dividen: [
    {
      id: id4,
      cash: 600
    }
  ]
}