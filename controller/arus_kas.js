const { ArusKas, LaporanKeuangan } = require('../models');
const response = require('../helper/response');
const t = require('../helper/transaction');

const find = async (req, res) => {
  try {
    const { emiten_id, jenis_laporan } = req.params;
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
      throw transaction.error;
    }
     // cek jika jenis laporan Q4
     if (jenis_laporan === 'Q4') {
      const Q1 = [];
      const Q2 = [];
      const Q3 = [];
      const Q4 = [];
      const TAHUNAN = [];

      // ambil seluruh laporan keuangan berdasarkan emiten_id
      const findLaporanKeuangan = await LaporanKeuangan.findAll({
        where: {
          emiten_id
        },
        attributes: ['tanggal', 'nama_file', 'jenis_laporan'],
        order: [['tanggal', 'ASC']],
        include: [
          {
            model: ArusKas,
            attributes: [
              'operasi', 'investasi', 'pendanaan'
            ],
            as: 'arus_kas'
          },
        ],
        transaction: transaction.data
      });
      // filter laporan keuangan Q1, Q2, Q3, TAHUNAN
      findLaporanKeuangan.forEach((data) => {
          if (data.jenis_laporan === 'Q1') {
            Q1.push(data.arus_kas);
          } else if (data.jenis_laporan === 'Q2') {
            Q2.push(data.arus_kas);
          } else if (data.jenis_laporan === 'Q3') {
            Q3.push(data.arus_kas);
          } else if (data.jenis_laporan === 'TAHUNAN') {
            TAHUNAN.push(data);
          }
      });
      // susun laporan Q4 
      TAHUNAN.forEach((data, i) => {
        const { tanggal, nama_file } = data;
        const { operasi, investasi, pendanaan } = data.arus_kas;
        Q4.push({
          tanggal,
          nama_file,
          jenis_laporan: 'Q4',
          arus_kas: {
            operasi: operasi - Q3[i].operasi - Q2[i].operasi - Q1[i].operasi,
            investasi: investasi - Q3[i].investasi - Q2[i].investasi - Q1[i].investasi,
            pendanaan: pendanaan - Q3[i].pendanaan - Q2[i].pendanaan - Q1[i].pendanaan,
          },
        });
      });
      return response(res, { status: 'success', data: Q4 });
    }
    //  cari laporan keuangan berdasarkan emiten_id, jenis_laporan
    const laporanKeuangan = await LaporanKeuangan.findAll({
      where: {
        emiten_id,
        jenis_laporan
      },
      attributes: ['tanggal', 'nama_file'],
      include: 
        {
          model: ArusKas,
          as: 'arus_kas',
          attributes: ['operasi', 'investasi', 'pendanaan'],
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