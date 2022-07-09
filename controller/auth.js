const { User } = require("../models");
const response = require("../helper/response");
const { passwordHash } = require("../helper/password");
const {
  createTokenActivation,
  verifyTokenActivation,
} = require("../helper/jwt");
const { HOST, PORT, CLIENT_URL } = process.env;
const sendEmail = require("../helper/send_email");

const register = async (req, res) => {
  const { nama_lengkap, email, password } = req.body;
  try {
    // cari data user berdasarkan email
    const getUser = await User.findOne({
      where: {
        email,
      },
    });
    if (getUser) {
      throw new Error(`${email} sudah ada`);
    }
    // buat password hash
    const myPassowrd = await passwordHash(password);
    const payload = {
      nama_lengkap,
      email,
      password: myPassowrd,
    };
    // buat token untuk aktivasi
    const tokenActivation = await createTokenActivation(payload);
    // send email untuk aktivasi
    const setDataEmail = {
      to: email,
      subject: "Email Verification",
      template: "email-verification",
      data: {
        firstname: nama_lengkap,
        email,
        url: `${CLIENT_URL}/auth/activation/${tokenActivation}`,
        src_send_email: `${HOST}:${PORT}/images/send_email.png`,
      },
    };
    await sendEmail(setDataEmail);
    return response(res, {
      status: "success",
      message:
        "Registrasi Behasil! cek email kamu untuk aktivasi, memasikan email kamu valid!",
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

const activation = async (req, res) => {
  const { token } = req.body;
  try {
    const { nama_lengkap, email, password } = await verifyTokenActivation(
      token
    );
    const [_, isCreateUser] = await User.findOrCreate({
      where: {
        email,
      },
      defaults: {
        nama_lengkap,
        email,
        password,
      },
    });
    if (!isCreateUser) {
      throw new Error(`${email} sudah ada dan sudah teraktivasi!`);
    }
    return response(res, {
      status: "success",
      message: "Email kamu berhasil diaktivasi!",
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
  register,
  activation,
};
