const { NeracaKeuangan, Emiten, LaporanKeuangan } = require("../models");
const response = require("../helper/response");

const find = async (req, res) => {
  try {
    const { kode_emiten, jenis_laporan } = req.params;
    // cari emiten untuk mendapatkan jumlah_saham
    const emiten = await Emiten.findOne({
      where: {
        kode_emiten,
      },
      attributes: ["id", "nama_emiten", "jumlah_saham"],
    });
    const { id: emiten_id, nama_emiten, jumlah_saham } = emiten;
    if (!emiten) {
      return response(
        res,
        {
          message: "Emiten not found",
        },
        404
      );
    }
    //  cari laporan keuangan berdasarkan emiten_id, jenis_laporan
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan,
      },
      attributes: ["tanggal", "harga_saham", "nama_file"],
      order: [["tanggal", "DESC"]],
      include: {
        model: NeracaKeuangan,
        as: "neraca_keuangan",
        attributes: [
          "aset",
          "kas_dan_setara_kas",
          "piutang",
          "persediaan",
          "aset_lancar",
          "aset_tidak_lancar",
          "liabilitas_jangka_pendek",
          "liabilitas_jangka_panjang",
          "liabilitas_berbunga",
          "ekuitas",
        ],
      },
    });

    if (!laporanKeuangan) {
      return response(
        res,
        {
          message: "Laporan keuangan not found",
        },
        404
      );
    }

    return response(res, {
      status: "success",
      jumlah_saham,
      nama_emiten,
      data: laporanKeuangan,
    });
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      500
    );
  }
};

module.exports = {
  find,
};
