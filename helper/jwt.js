const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACTIVATION_TOKEN_SECRET } = process.env;
const createTokenActivation = (payload) =>
  new Promise((resolve) =>
    resolve(jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: "15m" }))
  );

module.exports = {
  createTokenActivation,
};
