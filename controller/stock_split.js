const { Emiten, LaporanKeuangan, Sequelize, sequelize } = require('../models');
const response = require('../helper/response');
const t = require('../helper/transaction');

const update = async (req, res) => {
  try {
    const { emiten_id } = req.params;
    const { jumlah_saham, aksi, split } = req.body;
    // create transaction
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
      throw transaction.error;
    }
    // cek emiten
    const emiten = await Emiten.findByPk(emiten_id, { transaction: transaction.data });
    if (!emiten) {
      await t.rollback(transaction.data);
      return response(res, {
        message: 'Emiten not found'
      }, 404);
    }
    // update jumlah saham
    emiten.jumlah_saham = jumlah_saham;
    const updateEmiten = await emiten.save({ transaction: transaction.data });
    if (!updateEmiten) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Data Emiten failed updated');
    }
    // cek laporan keuangan berdasarkan emiten_id
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id
      }
    }, { transaction: transaction.data });
    if (!laporanKeuangan) {
      await t.rollback(transaction.data);
      return response(res, {
        message: 'Laporan keuangan not found'
      }, 404);
    }
    // update harga saham
    let updateLaporanKeuangan;
    const message = {
      status: 'success',
      message: ''
    };
    if (aksi == 'stock_split') {
      updateLaporanKeuangan = await LaporanKeuangan.update({
        harga_saham: Sequelize.literal(`harga_saham / ${split}`)
      },{
        where: {
          emiten_id
        },
        transaction: transaction.data
      });
      message.message = `Stock split successfully`;
    } else {
      // reverse_stock_split
      updateLaporanKeuangan = await LaporanKeuangan.update({
        harga_saham: Sequelize.literal(`harga_saham * ${split}`)
      }, {
        where: {
          emiten_id
        },
        transaction: transaction.data,
      });
      message.message = `Reverse stock split successfully`;
    }
    if (!updateLaporanKeuangan) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Data Laporan keuangan failed updated');
    }
    // commit transaction
    const commit = await t.commit(transaction.data);
    if (!commit.status && commit.error) {
        throw commit.error;
    }
    return response(res, message);
  } catch (error) {
    return response(res, {
      status: 'error',
      message: error.message
    }, 500);
  }
}

module.exports = {
  update
}