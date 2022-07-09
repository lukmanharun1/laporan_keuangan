const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACTIVATION_TOKEN_SECRET } = process.env;
const createTokenActivation = (payload) =>
  new Promise((resolve) =>
    resolve(jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: "15m" }))
  );

const verifyTokenActivation = (token) =>
  new Promise((resolve) => resolve(jwt.verify(token, ACTIVATION_TOKEN_SECRET)));

module.exports = {
  createTokenActivation,
  verifyTokenActivation,
};
