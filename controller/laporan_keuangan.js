const {
  Emiten,
  ArusKas,
  Dividen,
  LabaRugi,
  LaporanKeuangan,
  NeracaKeuangan,
  Sequelize,
} = require("../models");

const response = require("../helper/response");
const t = require("../helper/transaction");
const hapusFile = require("../helper/hapus_file");
const { LOCATION_LAPORAN_KEUANGAN, HOST, PORT } = process.env;

const find = async (req, res) => {
  try {
    const { kode_emiten, tanggal } = req.params;
    const replacePublic = LOCATION_LAPORAN_KEUANGAN.split("/")[1];
    const pathUpload = `${HOST}:${PORT}/${replacePublic}/`;
    const findLaporanKeuangan = await Emiten.findOne({
      where: {
        kode_emiten,
      },
      attributes: [],
      include: {
        model: LaporanKeuangan,
        where: {
          tanggal: new Date(tanggal),
        },
        attributes: [
          "nama_file",
          "jenis_laporan",
          "tanggal",
          [
            Sequelize.fn(
              "CONCAT",
              pathUpload,
              Sequelize.col("jenis_laporan"),
              "/",
              `${kode_emiten}/`,
              Sequelize.col("nama_file")
            ),
            "download",
          ],
        ],
        as: "laporan_keuangan",
      },
    });
    if (!findLaporanKeuangan) {
      return response(
        res,
        {
          message: "Laporan keuangan not found",
        },
        404
      );
    }
    return response(res, {
      status: "success",
      data: findLaporanKeuangan.laporan_keuangan[0],
    });
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      500
    );
  }
};
const create = async (req, res) => {
  // create transaction
  const transaction = await t.create();
  const { emiten_id, destination } = req;
  try {
    const {
      tanggal,
      jenis_laporan,
      harga_saham,
      nama_file,
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
      pendapatan,
      laba_kotor,
      laba_usaha,
      beban_bunga,
      laba_sebelum_pajak,
      laba_bersih,
      operasi,
      investasi,
      pendanaan,
      cash,
    } = req.body;

    // create laporan keuangan
    const createLaporanKeuangan = await LaporanKeuangan.create(
      {
        emiten_id,
        tanggal,
        jenis_laporan,
        harga_saham,
        nama_file,
      },
      { transaction: transaction.data }
    );

    if (!createLaporanKeuangan) {
      throw new Error("Laporan Keuangan failed created");
    }
    // create neraca keuangan
    const createNeracaKeuangan = await NeracaKeuangan.create(
      {
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
      },
      { transaction: transaction.data }
    );

    if (!createNeracaKeuangan) {
      throw new Error("Neraca Keuangan failed created");
    }
    // create laba rugi
    const createLabaRugi = await LabaRugi.create(
      {
        id: createLaporanKeuangan.id,
        pendapatan,
        laba_kotor,
        laba_usaha,
        beban_bunga,
        laba_sebelum_pajak,
        laba_bersih,
      },
      { transaction: transaction.data }
    );

    if (!createLabaRugi) {
      throw new Error("Laba Rugi failed created");
    }

    // create arus kas
    const createArusKas = await ArusKas.create(
      {
        id: createLaporanKeuangan.id,
        operasi,
        investasi,
        pendanaan,
      },
      { transaction: transaction.data }
    );

    if (!createArusKas) {
      throw new Error("Arus Kas failed created");
    }
    if (jenis_laporan === "TAHUNAN" && cash) {
      // create dividen
      const createDividen = await Dividen.create(
        {
          id: createLaporanKeuangan.id,
          cash,
        },
        { transaction: transaction.data }
      );

      if (!createDividen) {
        throw new Error("Dividen failed created");
      }
    }
    // commit transaction
    await t.commit(transaction.data);
    return response(
      res,
      {
        status: "success",
        message: "Data Laporan keuangan created successfully",
      },
      201
    );
  } catch (error) {
    await t.rollback(transaction.data);
    if (destination) hapusFile(destination);
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      500
    );
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    // create transaction
    const transaction = await t.create();
    if (!transaction.status && transaction.error) {
      throw transaction.error;
    }
    // cek laporan keuangan
    const findLaporanKeuangan = await LaporanKeuangan.findByPk(id, {
      transaction: transaction.data,
    });
    if (!findLaporanKeuangan) {
      // rollback transaction
      await t.rollback(transaction.data);
      return response(
        res,
        {
          message: "Laporan keuangan not found",
        },
        404
      );
    }

    // delete laporan keuangan, neraca keuangan, laba rugi, arus kas dividen
    const where = {
      where: {
        id,
      },
      transaction: transaction.data,
    };
    const deleteLaporanKeuangan = await Promise.all([
      LaporanKeuangan.destroy(where),
      NeracaKeuangan.destroy(where),
      LabaRugi.destroy(where),
      ArusKas.destroy(where),
      Dividen.destroy(where),
    ]);
    if (!deleteLaporanKeuangan[0]) {
      throw new Error("Laporan keuangan failed deleted");
    }
    await t.commit(transaction.data);
    return response(res, {
      status: "success",
      message: "Data Laporan Keuangan deleted successfully",
    });
  } catch (error) {
    return response(
      res,
      {
        status: "error",
        message: error.message,
      },
      500
    );
  }
};

module.exports = {
  find,
  create,
  destroy,
};
