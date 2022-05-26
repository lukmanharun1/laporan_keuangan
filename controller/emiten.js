const { Emiten, Sequelize } = require("../models");

const response = require("../helper/response");
const pagination = require("../helper/pagination");

const getAll = async (req, res) => {
  try {
    const where = {};
    const { kode_emiten, nama_emiten } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 1;
    if (kode_emiten) {
      where.kode_emiten = { [Sequelize.Op.like]: `%${kode_emiten}%` };
    }

    if (nama_emiten) {
      where.nama_emiten = { [Sequelize.Op.like]: `%${nama_emiten}%` };
    }
    const { count, rows } = await Emiten.findAndCountAll({
      where,
      offset: (page - 1) * page,
      limit: per_page,
      distinct: true,
      order: [["kode_emiten", "ASC"]],
      attributes: ["id", "kode_emiten", "nama_emiten", "jumlah_saham"],
    });

    const result = pagination({
      data: rows,
      count,
      page,
      per_page,
    });

    if (count <= 0) {
      return response(
        res,
        {
          message: "Emiten not found",
        },
        404
      );
    }

    return response(res, {
      status: "success",
      data: result,
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
  try {
    const { jumlah_saham, kode_emiten, nama_emiten } = req.body;
    const isCreateEmiten = await Emiten.findOrCreate({
      where: {
        kode_emiten: kode_emiten.toUpperCase(),
        nama_emiten: nama_emiten.toUpperCase(),
      },
      defaults: {
        jumlah_saham,
        kode_emiten: kode_emiten.toUpperCase(),
        nama_emiten: nama_emiten.toUpperCase(),
      },
    });

    if (!isCreateEmiten[1]) {
      return response(
        res,
        {
          status: "error",
          message: "Emiten Duplicated",
        },
        400
      );
    }
    return response(
      res,
      {
        status: "success",
        message: "Data Emiten Berhasil Ditambahkan",
      },
      201
    );
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { jumlah_saham, kode_emiten, nama_emiten } = req.body;
    // cari emiten
    const findEmitenById = await Emiten.findByPk(id);
    if (!findEmitenById) {
      return response(
        res,
        {
          message: "Emiten not found",
        },
        404
      );
    }

    if (jumlah_saham) findEmitenById.jumlah_saham = jumlah_saham;
    if (kode_emiten) findEmitenById.kode_emiten = kode_emiten.toUpperCase();
    if (nama_emiten) findEmitenById.nama_emiten = nama_emiten.toUpperCase();
    // update emiten
    const updateEmiten = await findEmitenById.save();
    if (!updateEmiten) {
      throw new Error("Data Emiten failed updated");
    }

    return response(res, {
      status: "success",
      message: "Data emiten update successfuly",
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
  getAll,
  create,
  update,
};
