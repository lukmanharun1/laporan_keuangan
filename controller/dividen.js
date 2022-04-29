const { Dividen, LaporanKeuangan, Emiten } = require('../models');
const response = require('../helper/response');

const find = async (req, res) => {
  try {
    const { kode_emiten } = req.params;
     // cari emiten untuk mendapatkan id
     const emiten = await Emiten.findOne({
      where: {
        kode_emiten
      },
      attributes: ['id', 'nama_emiten', 'jumlah_saham'],
    });
    const { id: emiten_id, jumlah_saham, nama_emiten } = emiten;
    //  cari laporan keuangan berdasarkan emiten_id, jenis_laporan TAHUNAN
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan: 'TAHUNAN'
      },
      attributes: ['tanggal', 'nama_file'],
      include: {
          model: Dividen,
          as: 'dividen',
          attributes: ['cash'],
        }
    });

    if (!laporanKeuangan) {
      return response(res, {
        message: 'Laporan keuangan not found'
      }, 404);
    }

    return response(res, {
      status: 'success',
      jumlah_saham,
      nama_emiten,
      data: laporanKeuangan
    });  

  } catch (error) {
    return response(res, {
      status: 'error',
      message: error.message
    }, 500);
  }
}

module.exports = {
  find
}