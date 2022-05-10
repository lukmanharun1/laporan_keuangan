const { Emiten, LaporanKeuangan, Sequelize, sequelize } = require("../models");
const response = require("../helper/response");
const t = require("../helper/transaction");

const update = async (req, res) => {
  // create transaction
  const transaction = await t.create();
  try {
    const { kode_emiten } = req.params;
    const { jumlah_saham, aksi, split } = req.body;
    // cek emiten
    const emiten = await Emiten.findOne(
      {
        where: {
          kode_emiten,
        },
      },
      {
        transaction: transaction.data,
      }
    );
    if (!emiten) {
      await t.rollback(transaction.data);
      return response(
        res,
        {
          message: "Emiten not found",
        },
        404
      );
    }
    const { id: emiten_id } = emiten;
    // update jumlah saham
    emiten.jumlah_saham = jumlah_saham;
    const updateEmiten = await emiten.save({ transaction: transaction.data });
    if (!updateEmiten) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error("Data Emiten failed updated");
    }
    // cek laporan keuangan berdasarkan kode_emiten
    const laporanKeuangan = await LaporanKeuangan.findAll(
      {
        where: {
          emiten_id,
        },
      },
      { transaction: transaction.data }
    );
    if (!laporanKeuangan) {
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
    // update harga saham
    let updateLaporanKeuangan;
    const message = {
      status: "success",
      message: "",
    };
    if (aksi == "stock_split") {
      updateLaporanKeuangan = await LaporanKeuangan.update(
        {
          harga_saham: Sequelize.literal(`harga_saham / ${split}`),
        },
        {
          where: {
            emiten_id,
          },
          transaction: transaction.data,
        }
      );
      message.message = `Stock split successfully`;
    } else {
      // reverse_stock_split
      updateLaporanKeuangan = await LaporanKeuangan.update(
        {
          harga_saham: Sequelize.literal(`harga_saham * ${split}`),
        },
        {
          where: {
            emiten_id,
          },
          transaction: transaction.data,
        }
      );
      message.message = `Reverse stock split successfully`;
    }
    if (!updateLaporanKeuangan) {
      // rollback transaction
      await t.rollback(transaction.data);
      throw new Error("Data Laporan keuangan failed updated");
    }
    // commit transaction
    await t.commit(transaction.data);
    return response(res, message);
  } catch (error) {
    // rollback transaction
    await t.rollback(transaction.data);
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
  update,
};
