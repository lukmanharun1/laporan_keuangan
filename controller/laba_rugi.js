const {
  LabaRugi,
  NeracaKeuangan,
  LaporanKeuangan,
  Emiten,
} = require("../models");
const cekLaporanTahunan = require("../helper/cek_laporan_tahunan");
const response = require("../helper/response");

const find = async (req, res) => {
  try {
    const { kode_emiten, jenis_laporan } = req.params;
    // cari emiten untuk mendapatkan id
    const emiten = await Emiten.findOne({
      where: {
        kode_emiten,
      },
      attributes: ["id", "nama_emiten", "jumlah_saham"],
    });
    const { id: emiten_id, jumlah_saham, nama_emiten } = emiten;
    if (!emiten) {
      return response(
        res,
        {
          message: "Emiten not found",
        },
        404
      );
    }
    // cek jika jenis laporan Q4
    if (jenis_laporan === "Q4") {
      const Q1 = [];
      const Q2 = [];
      const Q3 = [];
      const Q4 = [];
      const TAHUNAN = [];

      // ambil seluruh laporan keuangan berdasarkan emiten_id
      const findLaporanKeuangan = await LaporanKeuangan.findAll({
        where: {
          emiten_id,
        },
        attributes: ["tanggal", "nama_file", "jenis_laporan"],
        order: [["tanggal", "DESC"]],
        include: [
          {
            model: LabaRugi,
            attributes: [
              "pendapatan",
              "laba_kotor",
              "laba_usaha",
              "beban_bunga",
              "laba_sebelum_pajak",
              "laba_bersih",
            ],
            as: "laba_rugi",
          },
          {
            model: NeracaKeuangan,
            attributes: ["ekuitas", "aset"],
            as: "neraca_keuangan",
          },
        ],
      });
      if (!findLaporanKeuangan) {
        return response(
          res,
          {
            message: "Laporan Keuangan not found",
          },
          404
        );
      }
      // filter laporan keuangan Q1, Q2, Q3, TAHUNAN
      findLaporanKeuangan.forEach((dataLaporan) => {
        const tahunKuartal = dataLaporan.tanggal.toISOString().split("-")[0];
        if (dataLaporan.jenis_laporan === "Q1") {
          // filter lagi jenis laporan Q1 harus ada data laporan TAHUNAN
          if (cekLaporanTahunan(findLaporanKeuangan, tahunKuartal)) {
            Q1.push(dataLaporan.laba_rugi);
          }
        } else if (dataLaporan.jenis_laporan === "Q2") {
          // filter lagi jenis laporan Q2 harus ada data laporan TAHUNAN
          if (cekLaporanTahunan(findLaporanKeuangan, tahunKuartal)) {
            Q2.push(dataLaporan.laba_rugi);
          }
        } else if (dataLaporan.jenis_laporan === "Q3") {
          // filter lagi jenis laporan Q2 harus ada data laporan TAHUNAN
          if (cekLaporanTahunan(findLaporanKeuangan, tahunKuartal)) {
            Q3.push(dataLaporan.laba_rugi);
          }
        } else if (dataLaporan.jenis_laporan === "TAHUNAN") {
          TAHUNAN.push(dataLaporan);
        }
      });
      // susun laporan Q4
      TAHUNAN.forEach((data, i) => {
        const { tanggal, nama_file } = data;
        const {
          pendapatan,
          laba_kotor,
          laba_usaha,
          beban_bunga,
          laba_sebelum_pajak,
          laba_bersih,
        } = data.laba_rugi;
        const { aset, ekuitas } = data.neraca_keuangan;
        Q4.push({
          tanggal,
          nama_file,
          jenis_laporan: "Q4",
          laba_rugi: {
            pendapatan:
              pendapatan -
              Q3[i].pendapatan -
              Q2[i].pendapatan -
              Q1[i].pendapatan,
            laba_kotor:
              laba_kotor -
              Q3[i].laba_kotor -
              Q2[i].laba_kotor -
              Q1[i].laba_kotor,
            laba_usaha:
              laba_usaha -
              Q3[i].laba_usaha -
              Q2[i].laba_usaha -
              Q1[i].laba_usaha,
            beban_bunga:
              beban_bunga -
              Q3[i].beban_bunga -
              Q2[i].beban_bunga -
              Q1[i].beban_bunga,
            laba_sebelum_pajak:
              laba_sebelum_pajak -
              Q3[i].laba_sebelum_pajak -
              Q2[i].laba_sebelum_pajak -
              Q1[i].laba_sebelum_pajak,
            laba_bersih:
              laba_bersih -
              Q3[i].laba_bersih -
              Q2[i].laba_bersih -
              Q1[i].laba_bersih,
          },
          neraca_keuangan: {
            aset,
            ekuitas,
          },
        });
      });

      return response(res, {
        status: "success",
        jumlah_saham,
        nama_emiten,
        data: Q4,
      });
    }
    //  cari laporan keuangan berdasarkan kode_emiten, jenis_laporan
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan,
      },
      attributes: ["tanggal", "nama_file"],
      order: [["tanggal", "DESC"]],
      include: [
        {
          model: LabaRugi,
          attributes: [
            "pendapatan",
            "laba_kotor",
            "laba_usaha",
            "beban_bunga",
            "laba_sebelum_pajak",
            "laba_bersih",
          ],
          as: "laba_rugi",
        },
        {
          model: NeracaKeuangan,
          attributes: ["ekuitas", "aset"],
          as: "neraca_keuangan",
        },
      ],
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
