const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACTIVATION_TOKEN_SECRET, LOGIN_TOKEN_SECRET } = process.env;
const createTokenActivation = (payload) =>
  new Promise((resolve) =>
    resolve(jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: "15m" }))
  );

const verifyTokenActivation = (token) =>
  new Promise((resolve) => resolve(jwt.verify(token, ACTIVATION_TOKEN_SECRET)));

const createTokenLogin = (payload) =>
  new Promise((resolve) =>
    resolve(jwt.sign(payload, LOGIN_TOKEN_SECRET, { expiresIn: "7 days" }))
  );

module.exports = {
  createTokenActivation,
  verifyTokenActivation,
  createTokenLogin,
};
