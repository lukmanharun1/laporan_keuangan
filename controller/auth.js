const { User } = require("../models");
const response = require("../helper/response");
const { passwordHash, verifyPassword } = require("../helper/password");
const {
  createTokenActivation,
  verifyTokenActivation,
  createTokenLogin,
  createTokenForgotPassword,
  verifyTokenForgotPassword,
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
        nama_lengkap,
        email,
        url: `${CLIENT_URL}/auth/activation/${tokenActivation}`,
        src_send_email: `${HOST}:${PORT}/images/send_email.png`,
      },
    };
    await sendEmail(setDataEmail);
    return response(
      res,
      {
        status: "success",
        message:
          "Registrasi Behasil! cek email kamu untuk aktivasi, memasikan email kamu valid!",
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
    return response(
      res,
      {
        status: "success",
        message: "Email kamu berhasil diaktivasi!",
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
      400
    );
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // cari data user berdasarkan email
    const getUser = await User.findOne({
      where: {
        email,
      },
    });
    if (!getUser) {
      throw new Error("Email atau Password salah!");
    }
    // verifikasi password
    const isVerifyPassword = await verifyPassword(password, getUser.password);
    if (!isVerifyPassword) {
      throw new Error("Email atau Password salah!");
    }
    // buat token untuk login
    const token = await createTokenLogin({
      nama_lengkap: getUser.nama_lengkap,
      email,
      role: getUser.role,
    });

    return response(
      res,
      {
        status: "success",
        message: "Login Berhasil!",
        token,
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
      400
    );
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // cari data user berdasarkan email
    const getUser = await User.findOne({
      where: {
        email,
      },
    });
    if (!getUser) {
      throw new Error("Email kamu tidak dapat ditemukan!");
    }
    // buat token untuk forgot password
    const tokenForgotPassword = await createTokenForgotPassword({ email });
    // send email untuk forgot password
    const setDataEmail = {
      to: email,
      subject: "Forgot Password",
      template: "forgot-password",
      data: {
        nama_lengkap: getUser.nama_lengkap,
        email,
        url: `${CLIENT_URL}/auth/reset-password/${tokenForgotPassword}`,
        src_reset_password: `${HOST}:${PORT}/images/reset_password.png`,
      },
    };
    await sendEmail(setDataEmail);
    return response(
      res,
      {
        status: "success",
        message:
          "Forgot Password Behasil! cek email kamu untuk Reset Password!",
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
      400
    );
  }
};

const resetPassword = async (req, res) => {
  const { token, new_password } = req.body;
  try {
    // verifikasi token | buat password hash
    const [{ email }, password] = await Promise.all([
      verifyTokenForgotPassword(token),
      passwordHash(new_password),
    ]);
    // update password
    const updatePassword = await User.update(
      {
        password,
      },
      {
        where: {
          email,
        },
      }
    );
    if (!updatePassword[0]) {
      throw new Error("Password Gagal diupdate!");
    }
    return response(
      res,
      {
        status: "success",
        message: "Reset Password Berhasil!",
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
      400
    );
  }
};
module.exports = {
  register,
  activation,
  login,
  forgotPassword,
  resetPassword,
};
