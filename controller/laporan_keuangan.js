const { LaporanKeuangan } = require('../models');

const response = require('../helper/response');
const t = require('../helper/transaction');

const create = async (req, res) => {
  try {
    const { emiten_id, tanggal, jenis_laporan, nama_file, } = req.body;
     // create transaction
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
        throw transaction.error;
    }
  } catch (error) {
    
  }
}

module.exports = {
  create
}