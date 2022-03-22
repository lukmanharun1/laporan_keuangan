const { LabaRugi, NeracaKeuangan, LaporanKeuangan, Sequelize } = require('../models');
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
            model: LabaRugi,
            attributes: [
              'pendapatan', 'laba_kotor', 'laba_usaha',
              'laba_sebelum_pajak', 'laba_bersih'
            ],
            as: 'laba_rugi'
          },
          {
            model: NeracaKeuangan,
            attributes: ['ekuitas', 'aset'],
            as: 'neraca_keuangan'
          }
        ],
        transaction: transaction.data
      });
      // filter laporan keuangan Q1, Q2, Q3, TAHUNAN
      findLaporanKeuangan.forEach((data) => {
          if (data.jenis_laporan === 'Q1') {
            Q1.push(data.laba_rugi);
          } else if (data.jenis_laporan === 'Q2') {
            Q2.push(data.laba_rugi);
          } else if (data.jenis_laporan === 'Q3') {
            Q3.push(data.laba_rugi);
          } else if (data.jenis_laporan === 'TAHUNAN') {
            TAHUNAN.push(data);
          }
      });
      // susun laporan Q4 
      TAHUNAN.forEach((data, i) => {
        const { tanggal, nama_file } = data;
        const { pendapatan, laba_kotor, laba_usaha, laba_sebelum_pajak, laba_bersih } = data.laba_rugi;
        const { aset, ekuitas } = data.neraca_keuangan;
        Q4.push({
          tanggal,
          nama_file,
          jenis_laporan: 'Q4',
          laba_rugi: {
            pendapatan: pendapatan - Q3[i].pendapatan - Q2[i].pendapatan - Q1[i].pendapatan,
            laba_kotor: laba_kotor - Q3[i].laba_kotor - Q2[i].laba_kotor - Q1[i].laba_kotor,
            laba_usaha: laba_usaha - Q3[i].laba_usaha - Q2[i].laba_usaha - Q1[i].laba_usaha,
            laba_sebelum_pajak: laba_sebelum_pajak - Q3[i].laba_sebelum_pajak - Q2[i].laba_sebelum_pajak - Q1[i].laba_sebelum_pajak,
            laba_bersih: laba_bersih - Q3[i].laba_bersih - Q2[i].laba_bersih - Q1[i].laba_bersih,
          },
          neraca_keuangan: {
            aset,
            ekuitas
          }
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
      include: [
        {
          model: LabaRugi,
          attributes: [
            'pendapatan', 'laba_kotor', 'laba_usaha',
            'laba_sebelum_pajak', 'laba_bersih'
          ],
          as: 'laba_rugi'
        },
        {
          model: NeracaKeuangan,
          attributes: ['ekuitas', 'aset'],
          as: 'neraca_keuangan'
        }
      ],
      transaction: transaction.data
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