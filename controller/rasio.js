const {
  Emiten,
  LaporanKeuangan,
  NeracaKeuangan,
  LabaRugi,
  ArusKas,
  Dividen,
} = require("../models");
const response = require("../helper/response");
const hitungRasio = require("../helper/hitung_rasio");

const find = async (req, res) => {
  try {
    const { kode_emiten, jenis_laporan } = req.params;
    // cari emiten untuk mendapatkan jumlah_saham
    const emiten = await Emiten.findOne({
      where: {
        kode_emiten,
      },
      attributes: ["id", "jumlah_saham"],
    });
    const { id: emiten_id, jumlah_saham } = emiten;
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
      // inisialisasi data
      const Q1 = [];
      const Q2 = [];
      const Q3 = [];
      const Q4 = [];
      const TAHUNAN = [];
      // ambil seluruh laporan keuangan berdasarkan emiten_id
      const findAllLaporanKeuangan = await LaporanKeuangan.findAll({
        where: {
          emiten_id,
        },
        attributes: ["tanggal", "jenis_laporan", "harga_saham"],
        include: [
          {
            model: NeracaKeuangan,
            as: "neraca_keuangan",
            attributes: [
              "aset",
              "kas_dan_setara_kas",
              "persediaan",
              "aset_lancar",
              "liabilitas_jangka_pendek",
              "liabilitas_jangka_panjang",
              "liabilitas_berbunga",
              "ekuitas",
            ],
          },
          {
            model: LabaRugi,
            attributes: [
              "pendapatan",
              "laba_kotor",
              "laba_usaha",
              "beban_bunga",
              "laba_bersih",
            ],
            as: "laba_rugi",
          },
          {
            model: ArusKas,
            as: "arus_kas",
            attributes: ["operasi"],
          },
          {
            model: Dividen,
            as: "dividen",
            attributes: ["cash"],
          },
        ],
      });
      // filter laporan keuangan Q1, Q2, Q3, TAHUNAN
      findAllLaporanKeuangan.forEach(
        ({
          jenis_laporan,
          tanggal,
          harga_saham,
          neraca_keuangan,
          laba_rugi,
          arus_kas,
        }) => {
          if (jenis_laporan === "Q1") {
            Q1.push({
              laba_rugi,
              arus_kas,
            });
          } else if (jenis_laporan === "Q2") {
            Q2.push({
              laba_rugi,
              arus_kas,
            });
          } else if (jenis_laporan === "Q3") {
            Q3.push({
              laba_rugi,
              arus_kas,
            });
          } else if (jenis_laporan === "TAHUNAN") {
            TAHUNAN.push({
              laba_rugi,
              arus_kas,
            });
            // ambil data tanggal & harga saham & neraca keuangan untuk Q4 untuk di proses hitung rasio
            Q4.push({
              tanggal,
              harga_saham,
              neraca_keuangan,
            });
          }
        }
      );

      // susun laporan Q4 bagian data laba rugi & arus kas
      TAHUNAN.forEach(({ laba_rugi, arus_kas }, i) => {
        // susun laporan Q4 bagian laba rugi
        const { pendapatan, laba_kotor, laba_usaha, laba_bersih } = laba_rugi;
        Q4[i].laba_rugi = {
          pendapatan:
            pendapatan -
            Q3[i].laba_rugi.pendapatan -
            Q2[i].laba_rugi.pendapatan -
            Q1[i].laba_rugi.pendapatan,
          laba_kotor:
            laba_kotor -
            Q3[i].laba_rugi.laba_kotor -
            Q2[i].laba_rugi.laba_kotor -
            Q1[i].laba_rugi.laba_kotor,
          laba_usaha:
            laba_usaha -
            Q3[i].laba_rugi.laba_usaha -
            Q2[i].laba_rugi.laba_usaha -
            Q1[i].laba_rugi.laba_usaha,
          beban_bunga:
            beban_bunga -
            Q3[i].laba_rugi.beban_bunga -
            Q2[i].laba_rugi.beban_bunga -
            Q1[i].laba_rugi.beban_bunga,
          laba_bersih:
            laba_bersih -
            Q3[i].laba_rugi.laba_bersih -
            Q2[i].laba_rugi.laba_bersih -
            Q1[i].laba_rugi.laba_bersih,
        };

        // susun laporan Q4 bagian arus kas
        const { operasi } = arus_kas;
        Q4[i].arus_kas = {
          operasi:
            operasi -
            Q3[i].arus_kas.operasi -
            Q2[i].arus_kas.operasi -
            Q1[i].arus_kas.operasi,
        };
      });

      const dataRes = hitungRasio(Q4, jumlah_saham, jenis_laporan);
      return response(res, {
        status: "success",
        data: dataRes,
      });
    }

    // ambil seluruh data laporan keuangan berdasarkan jenis_laporan
    const dataLaporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan,
      },
      attributes: ["tanggal", "harga_saham"],
      include: [
        {
          model: NeracaKeuangan,
          as: "neraca_keuangan",
          attributes: [
            "aset",
            "kas_dan_setara_kas",
            "persediaan",
            "aset_lancar",
            "liabilitas_jangka_pendek",
            "liabilitas_jangka_panjang",
            "liabilitas_berbunga",
            "ekuitas",
          ],
        },
        {
          model: LabaRugi,
          attributes: [
            "pendapatan",
            "laba_kotor",
            "laba_usaha",
            "beban_bunga",
            "laba_bersih",
          ],
          as: "laba_rugi",
        },
        {
          model: ArusKas,
          as: "arus_kas",
          attributes: ["operasi"],
        },
        {
          model: Dividen,
          as: "dividen",
          attributes: ["cash"],
        },
      ],
    });
    if (!dataLaporanKeuangan) {
      return response(
        res,
        {
          message: "Laporan Keuangan not found",
        },
        404
      );
    }
    const dataResponse = hitungRasio(
      dataLaporanKeuangan,
      jumlah_saham,
      jenis_laporan
    );
    return response(res, {
      status: "success",
      data: dataResponse,
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
