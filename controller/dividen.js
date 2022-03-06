const { Dividen, LaporanKeuangan } = require('../models');
const response = require('../helper/response');
const t = require('../helper/transaction');

const find = async (req, res) => {
  try {
    const { emiten_id, jenis_laporan } = req.params;
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
      throw transaction.error;
    }
    
    //  cari laporan keuangan berdasarkan emiten_id, jenis_laporan
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan
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
      throw new Error('Dividen not found');
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
    
  }
}

module.exports = {
  find
}