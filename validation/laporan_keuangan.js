const { body, param } = require("express-validator");
const validasiKodeEmiten = require("./validasi_kode_emiten");
const validasiTanggal = require("./validasi_tanggal");

const find = () => [
  param("kode_emiten").notEmpty().custom(validasiKodeEmiten),
  param("tanggal")
    .notEmpty()
    .isDate({ format: "YYYY-MM-DD" })
    .custom((value) => {
      const [tahun, bulan, tanggal] = value.split("-");
      if (
        (tanggal == 31 && bulan == 3) ||
        (tanggal == 30 && bulan == 6) ||
        (tanggal == 30 && bulan == 9) ||
        (tanggal == 31 && bulan == 12)
      ) {
        return true;
      }
      throw new Error("Tanggal tidak valid");
    }),
];

const create = () => [
  // laporan keuangan
  body("nama_file").notEmpty().isString(),
  body("tanggal")
    .notEmpty()
    .isDate({ format: "YYYY-MM-DD" })
    .custom(validasiTanggal),
  body("jenis_laporan").notEmpty().isIn(["Q1", "Q2", "Q3", "TAHUNAN"]),
  body("harga_saham").notEmpty().isInt(),

  // neraca keuangan
  body("aset").notEmpty().isInt(),
  body("kas_dan_setara_kas").notEmpty().isInt(),
  body("piutang").notEmpty().isInt(),
  body("persediaan").notEmpty().isInt(),
  body("aset_lancar").notEmpty().isInt(),
  body("aset_tidak_lancar").notEmpty().isInt(),
  body("liabilitas_jangka_pendek").notEmpty().isInt(),
  body("liabilitas_jangka_panjang").notEmpty().isInt(),
  body("liabilitas_berbunga").notEmpty().isInt(),
  body("ekuitas").notEmpty().isInt(),

  // laba rugi

  body("pendapatan").notEmpty().isInt(),
  body("laba_kotor").notEmpty().isInt(),
  body("laba_usaha").notEmpty().isInt(),
  body("beban_bunga").notEmpty().isInt({ lt: 1 }),
  body("laba_sebelum_pajak").notEmpty().isInt(),
  body("laba_bersih").notEmpty().isInt(),

  // arus kas

  body("operasi").notEmpty().isInt(),
  body("investasi").notEmpty().isInt(),
  body("pendanaan").notEmpty().isInt(),

  // dividen
  body("cash").optional().isInt(),
];

const destroy = () => [param("id").notEmpty().isUUID()];

module.exports = {
  find,
  create,
  destroy,
};
