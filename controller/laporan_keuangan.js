const { ArusKas, Dividen, LabaRugi, LaporanKeuangan, NeracaKeuangan } = require('../models');

const response = require('../helper/response');
const t = require('../helper/transaction');
const hapusFile = require('../helper/hapus_file');

const create = async (req, res) => {
  try {
    const { emiten_id, tanggal, jenis_laporan, harga_saham, nama_file,
            aset, kas_dan_setara_kas, piutang, persediaan, aset_lancar, aset_tidak_lancar,
            liabilitas_jangka_pendek, liabilitas_jangka_panjang, liabilitas_berbunga, ekuitas,
            pendapatan, laba_kotor, laba_usaha, laba_sebelum_pajak, laba_bersih,
            operasi, investasi, pendanaan, cash
          } = req.body;
     // create transaction
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
        throw transaction.error;
    }

    // create laporan keuangan
    const createLaporanKeuangan = await LaporanKeuangan.create({
      emiten_id,
      tanggal,
      jenis_laporan,
      harga_saham,
      nama_file
    }, { transaction: transaction.data });

    if (!createLaporanKeuangan) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Laporan Keuangan failed created');
    }

    // create neraca keuangan
    const createNeracaKeuangan = await NeracaKeuangan.create({
      id: createLaporanKeuangan.id,
      aset,
      kas_dan_setara_kas,
      piutang,
      persediaan,
      aset_lancar,
      aset_tidak_lancar,
      liabilitas_jangka_pendek,
      liabilitas_jangka_panjang,
      liabilitas_berbunga,
      ekuitas,
    }, { transaction: transaction.data });

    if (!createNeracaKeuangan) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Neraca Keuangan failed created');
    }

    // create laba rugi
    
    const createLabaRugi = await LabaRugi.create({
      id: LaporanKeuangan.id,
      pendapatan,
      laba_kotor,
      laba_usaha,
      laba_sebelum_pajak,
      laba_bersih
    }, { transaction: transaction.data });

    if (!createLabaRugi) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Laba Rugi failed created');
    }

    // create arus kas

    const createArusKas = await ArusKas.create({
      id: LaporanKeuangan.id,
      operasi,
      investasi,
      pendanaan,
    }, { transaction: transaction.data });

    if (!createArusKas) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error('Arus Kas failed created');
    }
    
    
    if (jenis_laporan === "TAHUNAN" && cash) {
      // create dividen
      const createDividen = await Dividen.create({
        id: LaporanKeuangan.id,
        cash
      }, { transaction: transaction.data });

      if (!createDividen) {
        // rollback transaction
        await t.rollback(transaction.data);
        throw new Error('Dividen failed created');
      }
    }
     // commit transaction
     const commit = await t.commit(transaction.data);
     if (!commit.status && commit.error) {
         throw commit.error;
     }
     return response(res, {
       status: 'success',
       message: 'Data Laporan Keuangan Berhasil Ditambahkan'
     });  
  } catch (error) {
    hapusFile(req.destination);
    return response(res, {
      status: 'error',
      message: error.message
    }, 500);
  }
}

module.exports = {
  create
}