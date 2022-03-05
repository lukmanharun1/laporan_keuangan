const { Emiten } = require('../models');

const response = require('../helper/response');
const t = require('../helper/transaction');

const create = async (req, res) => {
  try {
    const { jumlah_saham, kode_emiten, nama_emiten } = req.body;
    // create transaction
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
        throw transaction.error;
    }
    const createEmiten = await Emiten.create({
      jumlah_saham,
      kode_emiten: kode_emiten.toUpperCase(),
      nama_emiten: nama_emiten.toUpperCase(),
    }, { transaction: transaction.data });

    if (!createEmiten) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Emiten failed created');
    }
    // commit transaction
    const commit = await t.commit(transaction.data);
    if (!commit.status && commit.error) {
        throw commit.error;
    }
    return response(res, {
      status: 'success',
      message: 'Data Emiten Berhasil Ditambahkan'
    });  
  } catch (error) {
    return response(res, {
      status: 'error',
      message: error.message
    }, 500);
  }
}

module.exports = {
  create
};