const multer = require("multer");
const path = require("path");
const {
  Emiten,
  LaporanKeuangan,
  LabaRugi,
  ArusKas,
  Sequelize,
} = require("../models");
const { LOCATION_LAPORAN_KEUANGAN } = process.env;
const formatTanggal = require("../helper/format_tanggal");
const createFolder = require("../helper/create_folder");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { jenis_laporan, kode_emiten } = req.body;
    const url = `${LOCATION_LAPORAN_KEUANGAN}/${jenis_laporan}/`;
    // create folder untuk kode emiten
    createFolder(url, kode_emiten);
    cb(null, `${url}/${kode_emiten}/`);
  },
  filename: async (req, file, cb) => {
    try {
      // cek table Emiten
      const { jenis_laporan, kode_emiten, tanggal } = req.body;
      const getEmiten = await Emiten.findOne({
        where: {
          kode_emiten,
        },
        attributes: ["id"],
      });

      if (!getEmiten) {
        return cb("Emiten not found");
      }
      const emiten_id = getEmiten.id;
      // kirim data ke controller untuk di proses
      req.emiten_id = emiten_id;

      // cek emiten_id & tanggal agar laporan_keuangan tidak duplikat
      const getLaporanKeuangan = await LaporanKeuangan.findOne({
        where: {
          emiten_id,
          tanggal: new Date(tanggal),
        },
      });
      const [tahun] = tanggal.split("-");
      const quarter = [
        new Date(`${tahun}-03-31`),
        new Date(`${tahun}-06-30`),
        new Date(`${tahun}-09-30`),
      ];
      if (getLaporanKeuangan) {
        return cb("Laporan keuangan duplicate");
      }
      // cek jenis_laporan jika Q2 harus ada laporan Q1
      if (jenis_laporan === "Q2") {
        const laporanKeuanganQ1 = await LaporanKeuangan.findOne({
          where: {
            emiten_id,
            tanggal: quarter[0],
          },
          attributes: [],
          include: [
            {
              model: LabaRugi,
              as: "laba_rugi",
              attributes: [
                "pendapatan",
                "laba_kotor",
                "laba_usaha",
                "beban_bunga",
                "laba_sebelum_pajak",
                "laba_bersih",
              ],
            },
            {
              model: ArusKas,
              as: "arus_kas",
              attributes: ["operasi", "investasi", "pendanaan"],
            },
          ],
        });
        if (!laporanKeuanganQ1) {
          req.message = "Lengkapi laporan keuangan Q1";
          return cb("Lengkapi laporan keuangan Q1");
        }
        // rewriteBody
        req.rewriteBody = {
          laba_rugi: laporanKeuanganQ1.laba_rugi,
          arus_kas: laporanKeuanganQ1.arus_kas,
        };
      }
      // cek jenis_laporan jika Q3 harus ada laporan Q1, Q2
      else if (jenis_laporan === "Q3") {
        const laporanKeuanganQ1Q2 = await LaporanKeuangan.findAll({
          where: {
            emiten_id,
            tanggal: {
              [Sequelize.Op.in]: [quarter[0], quarter[1]],
            },
          },
          order: [["tanggal", "ASC"]],
          attributes: [],
          include: [
            {
              model: LabaRugi,
              as: "laba_rugi",
              attributes: [
                "pendapatan",
                "laba_kotor",
                "laba_usaha",
                "beban_bunga",
                "laba_sebelum_pajak",
                "laba_bersih",
              ],
            },
            {
              model: ArusKas,
              as: "arus_kas",
              attributes: ["operasi", "investasi", "pendanaan"],
            },
          ],
        });

        if (laporanKeuanganQ1Q2.length !== 2) {
          return cb("Lengkapi laporan keuangan Q1, Q2");
        }
        const [Q1, Q2] = laporanKeuanganQ1Q2;
        // jumlahkan Q1 + Q2
        const pendapatan = Q1.laba_rugi.pendapatan + Q2.laba_rugi.pendapatan;
        const laba_kotor = Q1.laba_rugi.laba_kotor + Q2.laba_rugi.laba_kotor;
        const laba_usaha = Q1.laba_rugi.laba_usaha + Q2.laba_rugi.laba_usaha;
        const beban_bunga = Q1.laba_rugi.beban_bunga + Q2.laba_rugi.beban_bunga;
        const laba_sebelum_pajak =
          Q1.laba_rugi.laba_sebelum_pajak + Q2.laba_rugi.laba_sebelum_pajak;
        const laba_bersih = Q1.laba_rugi.laba_bersih + Q2.laba_rugi.laba_bersih;

        const operasi = Q1.arus_kas.operasi + Q2.arus_kas.operasi;
        const investasi = Q1.arus_kas.investasi + Q2.arus_kas.investasi;
        const pendanaan = Q1.arus_kas.pendanaan + Q2.arus_kas.pendanaan;

        // rewriteBody untuk (Q1 + Q2) - Q3 -> req.body
        req.rewriteBody = {
          laba_rugi: {
            pendapatan,
            laba_kotor,
            laba_usaha,
            beban_bunga,
            laba_sebelum_pajak,
            laba_bersih,
          },
          arus_kas: {
            operasi,
            investasi,
            pendanaan,
          },
        };
      }
      // cek jenis_laporan jika TAHUNAN harus ada laporan Q1, Q2, Q3
      else if (jenis_laporan === "TAHUNAN") {
        const hitungLaporanKeuangan = await LaporanKeuangan.count({
          where: {
            emiten_id,
            tanggal: {
              [Sequelize.Op.in]: quarter,
            },
          },
        });
        if (hitungLaporanKeuangan !== 3) {
          return cb("Lengkapi laporan keuangan Q1, Q2, Q3");
        }
      }

      const formatNamaFile = `${kode_emiten} ${jenis_laporan} ${formatTanggal(
        tanggal
      )}${path.extname(file.originalname).toLowerCase()}`;
      // kirim data ke controller untuk di proses
      req.destination = `${LOCATION_LAPORAN_KEUANGAN}/${jenis_laporan}/${kode_emiten}/${formatNamaFile}`;
      // nama file untuk dimasukan ke database
      req.body.nama_file = formatNamaFile;
      return cb(null, formatNamaFile);
    } catch (error) {
      cb(`Server Error ${error.message}`);
    }
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, //limit 50mb
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("nama_file");

function checkFileType(file, cb) {
  const fileTypes = /pdf/;
  const extName = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Laporan Keuangan Harus PDF");
  }
}
module.exports = uploadFile;
