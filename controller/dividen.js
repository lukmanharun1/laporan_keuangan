const { Dividen, LaporanKeuangan } = require('../models');
const response = require('../helper/response');
const t = require('../helper/transaction');

const find = async (req, res) => {
  try {
    const { kode_emiten } = req.params;
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
      throw transaction.error;
    }
     // cari emiten untuk mendapatkan id
     const emiten = await Emiten.findOne({
      where: {
        kode_emiten
      },
      attributes: ['id'],
      transaction: transaction.data
    });
    const { id: emiten_id } = emiten;
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
      // rollback transaction
      await t.rollback(transaction.data);
      return response(res, {
        message: 'Laporan keuangan not found'
      }, 404);
    }

    // commit transaction
    const commit = await t.commit(transaction.data);
    if (!commit.status && commit.error) {
        throw commit.error;
    }
    return response(res, {
      status: 'success',
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