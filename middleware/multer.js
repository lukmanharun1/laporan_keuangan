const multer = require("multer");
const path = require("path");
const { Emiten } = require('../models');
const formatTanggal = require('../helper/format_tanggal');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, `public/laporan_keuangan/${req.body.jenis_laporan}/`);
      
  },
  filename: async (req, file, cb) => {
    // cek table Emiten
    
    const { jenis_laporan, emiten_id, tanggal } = req.body;
      const getEmiten = await Emiten.findOne({
        where: {
          id: emiten_id
        },
        attributes: ['kode_emiten']
      });
      if (!getEmiten) {
        return cb('Emiten not found');
      }
   
    const formatNamaFile = `${getEmiten.kode_emiten} ${jenis_laporan} ${formatTanggal(tanggal)}${path.extname(file.originalname)}`;
    cb(null, formatNamaFile);
    req.destination = `public/laporan_keuangan/${req.body.jenis_laporan}/${formatNamaFile}`;
    req.body.nama_file = formatNamaFile;
  }
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 50000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single("nama_file");


function checkFileType(file, cb) {
  const fileTypes = /pdf/;
  const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Laporan Keuangan Harus PDF");
  }
}
module.exports = uploadFile;