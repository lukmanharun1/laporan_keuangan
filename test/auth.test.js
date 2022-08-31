const request = require("supertest");
const app = require("../app");
const {
  createTokenActivation,
  createTokenForgotPassword,
  createTokenLogin,
} = require("../helper/jwt");
const { passwordHash } = require("../helper/password");
const randomAlphabert = require("../helper/random_alphabert");
const data = {
  nama_lengkap: `lukman ${randomAlphabert(4)}`,
  email: `lukman${randomAlphabert(4)}@gmail.com`,
  password: `Lukman@${randomAlphabert(5)}1`,
};
describe("POST /auth/register", () => {
  it("should create register success", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(data)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message:
          "Daftar Akun Behasil! cek email kamu untuk aktivasi, memasikan email kamu valid!",
      })
    );
  });

  it("should create register failed", async () => {
    await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send({})
      .expect(400);
  });
});

describe("POST /auth/activation", () => {
  it("should create activation success", async () => {
    const password = await passwordHash(data.password);
    const token = await createTokenActivation({
      nama_lengkap: data.nama_lengkap,
      email: data.email,
      password,
    });
    const createActivation = await request(app)
      .post("/auth/activation")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(201);

    expect(createActivation.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Email kamu berhasil diaktivasi!",
      })
    );
    // send lagi dan dipastikan sudah teraktivasi
    const createdActivation = await request(app)
      .post("/auth/activation")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(200);

    expect(createdActivation.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: `${data.email} sudah ada dan sudah teraktivasi!`,
      })
    );
  });

  it("should create activation failed", async () => {
    await request(app)
      .post("/auth/activation")
      .set("Accept", "application/json")
      .send({})
      .expect(400);
    const token = await createTokenForgotPassword(data);
    const resInvalidSignature = await request(app)
      .post("/auth/activation")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(422);

    expect(resInvalidSignature.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: {
          name: "JsonWebTokenError",
          message: "invalid signature",
        },
      })
    );
  });
});

describe("POST /auth/login", () => {
  it("should create login success", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({ email: data.email, password: data.password })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Login Berhasil!",
        token: response.body.token,
      })
    );
  });

  it("should create login failed", async () => {
    await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({})
      .expect(400);

    // skenario email dan password salah
    const response1 = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({ email: "salah@gmail.com", password: "password@Salah1" })
      .expect(400);

    expect(response1.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Email atau Password salah!",
      })
    );

    // skenario email benar dan password salah
    const response2 = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({ email: data.email, password: "password@Salah1" })
      .expect(400);

    expect(response2.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Email atau Password salah!",
      })
    );
  });
});

describe("POST /auth/forgot-password", () => {
  it("should forgot password success", async () => {
    const response = await request(app)
      .post("/auth/forgot-password")
      .set("Accept", "application/json")
      .send({ email: data.email })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message:
          "Forgot Password Behasil! cek email kamu untuk Reset Password!",
      })
    );
  });

  it("should forgot password failed", async () => {
    await request(app)
      .post("/auth/forgot-password")
      .set("Accept", "application/json")
      .send({})
      .expect(400);

    const response = await request(app)
      .post("/auth/forgot-password")
      .set("Accept", "application/json")
      .send({ email: "salah@gmail.com" })
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Email kamu tidak dapat ditemukan!",
      })
    );
  });
});

describe("POST /auth/reset-password", () => {
  const new_password = `new@${randomAlphabert(5)}1`;
  it("should reset password success", async () => {
    const token = await createTokenForgotPassword({ email: data.email });

    const response = await request(app)
      .post("/auth/reset-password")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .send({ new_password })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Reset Password Berhasil!",
      })
    );
  });

  it("should reset password failed", async () => {
    await request(app)
      .post("/auth/reset-password")
      .set("Accept", "application/json")
      .send({})
      .expect(400);

    // token tidak valid
    const tokenTidakValid = await createTokenActivation({
      email: "valid@gmail.com",
    });
    const resInvalidSignature = await request(app)
      .post("/auth/reset-password")
      .set("Accept", "application/json")
      .set("Authorization", tokenTidakValid)
      .send({ new_password })
      .expect(400);
    expect(resInvalidSignature.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: {
          name: "JsonWebTokenError",
          message: "invalid signature",
        },
      })
    );

    const tokenValid = await createTokenForgotPassword({
      email: "salah@gmail.com",
    });
    const response = await request(app)
      .post("/auth/reset-password")
      .set("Accept", "application/json")
      .set("Authorization", tokenValid)
      .send({ new_password })
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "error",
        message: "Password Gagal diupdate!",
      })
    );
  });
});

describe("POST /auth/verify-token", () => {
  it("should verify token success", async () => {
    const token = await createTokenLogin({
      nama_lengkap: data.nama_lengkap,
      email: data.email,
    });
    const response = await request(app)
      .post("/auth/verify-token")
      .set("Authorization", token)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: "Token jwt valid!",
      })
    );
  });

  it("should verify token failed", async () => {
    await request(app).post("/auth/verify-token").expect(400);
  });
});
