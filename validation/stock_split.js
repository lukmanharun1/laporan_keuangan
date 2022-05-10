const { param, body } = require("express-validator");
const validasiKodeEmiten = require("./validasi_kode_emiten");

const update = () => [
  param("kode_emiten").notEmpty().custom(validasiKodeEmiten),
  body("jumlah_saham").notEmpty().isInt(),
  body("aksi").notEmpty().isIn(["stock_split", "reverse_stock_split"]),
  body("split").notEmpty().isInt({ min: 2, max: 20 }),
];

module.exports = {
  update,
};
