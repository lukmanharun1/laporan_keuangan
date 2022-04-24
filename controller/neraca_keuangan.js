const { NeracaKeuangan, Emiten, LaporanKeuangan } = require('../models');
const response = require('../helper/response');
const t = require('../helper/transaction');

const find = async (req, res) => {
  try {
    const { kode_emiten, jenis_laporan } = req.params;
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
      throw transaction.error;
    }
    
    // cari emiten untuk mendapatkan jumlah_saham
    const emiten = await Emiten.findOne({
      where: {
        kode_emiten
      },
      attributes: ['id', 'nama_emiten', 'jumlah_saham'],
      transaction: transaction.data
    });
    const { id: emiten_id, nama_emiten, jumlah_saham } = emiten;
    if (!emiten) {
      // rollback transaction
      await t.rollback(transaction.data);
      return response(res, {
        message: 'Emiten not found'
      }, 404);
    }
    //  cari laporan keuangan berdasarkan emiten_id, jenis_laporan
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan
      },
      attributes: ['tanggal', 'harga_saham', 'nama_file'],
      include: {
        model: NeracaKeuangan,
        as: 'neraca_keuangan',
        attributes: [
        'aset', 'kas_dan_setara_kas', 'piutang', 'persediaan',
        'aset_lancar', 'aset_tidak_lancar', 'liabilitas_jangka_pendek',
        'liabilitas_jangka_panjang', 'liabilitas_berbunga', 'ekuitas'
        ]
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