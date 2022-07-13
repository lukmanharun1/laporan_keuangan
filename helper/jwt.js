const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACTIVATION_TOKEN_SECRET, LOGIN_TOKEN_SECRET, FORGOT_PASSWORD_SECRET } =
  process.env;
const createTokenActivation = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      ACTIVATION_TOKEN_SECRET,
      { expiresIn: "15m" },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    )
  );

const verifyTokenActivation = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, ACTIVATION_TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    })
  );

const createTokenLogin = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      LOGIN_TOKEN_SECRET,
      { expiresIn: "7 days" },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    )
  );

const verifyTokenLogin = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, LOGIN_TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    })
  );

const createTokenForgotPassword = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      FORGOT_PASSWORD_SECRET,
      { expiresIn: "15 m" },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    )
  );

const verifyTokenForgotPassword = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, FORGOT_PASSWORD_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    })
  );

module.exports = {
  createTokenActivation,
  verifyTokenActivation,
  createTokenLogin,
  verifyTokenLogin,
  createTokenForgotPassword,
  verifyTokenForgotPassword,
};
