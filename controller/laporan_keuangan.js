const { Emiten } = require('../models');

const response = require('../helper/response');
const t = require('../helper/transaction');

const create = async (req, res) => {
  return response(res, req.body);
}

module.exports = {
  create
}