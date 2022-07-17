const request = require("supertest");
const app = require("../app");
const { LaporanKeuangan } = require("../models");
const randomAlphabert = require("../helper/random_alphabert");
const formatTanggal = require("../helper/format_tanggal");
const cekFile = require("../helper/cek_file");
const deleteFolder = require("../helper/delete_folder");
const kodeEmiten = randomAlphabert(4);
const { HOST, PORT, LOCATION_LAPORAN_KEUANGAN } = process.env;
const { createTokenLoginSync } = require("../helper/jwt");
const payloadUser = {
  nama_lengkap: "lukman harun",
  email: "lukman@gmail.com",
  role: "user",
};
const payloadAdmin = {
  ...payloadUser,
  role: "admin",
};
const tokenUser = createTokenLoginSync(payloadUser);
const tokenAdmin = createTokenLoginSync(payloadAdmin);

const sendCreateEmiten = {
  jumlah_saham: 200000000,
  kode_emiten: kodeEmiten,
  nama_emiten: `PT ${kodeEmiten} AGRO LESTARI TBK`,
};
const sendCreateLaporanKeuangan = {
  kode_emiten: kodeEmiten,
  tanggal: "2021-03-31",
  jenis_laporan: "Q1",
  harga_saham: 2900,
  aset: 1000000,
  kas_dan_setara_kas: 1000000,
  piutang: 1000000,
  persediaan: 1000000,
  aset_lancar: 1000000,
  aset_tidak_lancar: 1000000,
  liabilitas_jangka_pendek: 1000000,
  liabilitas_jangka_panjang: 1000000,
  liabilitas_berbunga: 1000000,
  ekuitas: 1000000,
  pendapatan: 1000000,
  laba_kotor: 1000000,
  laba_usaha: 1000000,
  beban_bunga: -100000,
  laba_sebelum_pajak: 1000000,
  laba_bersih: 1000000,
  operasi: 1000000,
  investasi: 1000000,
  pendanaan: 1000000,
};

describe("POST /laporan-keuangan", () => {
  it("should create laporan keuangan success", async () => {
    // create emiten
    const { kode_emiten, nama_emiten } = sendCreateEmiten;
    await request(app)
      .post("/emiten")
      .set("Accept", "application/json")
      .set("Authorization", tokenAdmin)
      .send(sendCreateEmiten)
      .expect(201);

    // get emiten menggunakan query params
    await request(app)
      .get("/emiten")
      .query({
        kode_emiten,
        nama_emiten,
        page: 1,
        per_page: 1,
      })
      .set("Accept", "application/json")
      .set("Authorization", tokenUser)
      .expect(200);

    // create laporan keuangan

    const {
      tanggal,
      jenis_laporan,
      harga_saham,
      aset,
      kas_dan_setara_kas,
      piutang,
      persediaan,
      aset_lancar,
      aset_tidak_lancar,
      liabilitas_jangka_pendek,
      liabilitas_jangka_panjang,
      liabilitas_berbunga,
      ekuitas,
      pendapatan,
      laba_kotor,
      laba_usaha,
      beban_bunga,
      laba_sebelum_pajak,
      laba_bersih,
      operasi,
      investasi,
      pendanaan,
    } = sendCreateLaporanKeuangan;

    const response = await request(app)
      .post("/laporan-keuangan")
      .set("Accept", "application/json")
      .set("Authorization", tokenAdmin)
      .set("Content-Type", "multipart/form-data")
      .field("tanggal", tanggal)
      .field("kode_emiten", kode_emiten)
      .field("jenis_laporan", jenis_laporan)
      .field("harga_saham", harga_saham)
      .field("aset", aset)
      .field("kas_dan_setara_kas", kas_dan_setara_kas)
      .field("piutang", piutang)
      .field("persediaan", persediaan)
      .field("aset_lancar", aset_lancar)
      .field("aset_tidak_lancar", aset_tidak_lancar)
      .field("liabilitas_jangka_pendek", liabilitas_jangka_pendek)
      .field("liabilitas_jangka_panjang", liabilitas_jangka_panjang)
      .field("liabilitas_berbunga", liabilitas_berbunga)
      .field("ekuitas", ekuitas)
      .field("pendapatan", pendapatan)
      .field("laba_kotor", laba_kotor)
      .field("laba_usaha", laba_usaha)
      .field("beban_bunga", beban_bunga)
      .field("laba_sebelum_pajak", laba_sebelum_pajak)
      .field("laba_bersih", laba_bersih)
      .field("operasi", operasi)
      .field("investasi", investasi)
      .field("pendanaan", pendanaan)
      .attach("nama_file", __dirname + "/test.pdf")
      .expect(201);

    // cek file apakah berhasil di upload
    const nama_file = `${kode_emiten} ${jenis_laporan} ${formatTanggal(
      tanggal
    )}.pdf`;
    const pathFolder = `${LOCATION_LAPORAN_KEUANGAN}/${jenis_laporan}/${kode_emiten}`;
    const pathFile = `${pathFolder}/${nama_file}`;

    expect(await cekFile(pathFile)).toEqual(true);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: response.body.message,
      })
    );
    // delete foder karena untuk test saja
    expect(await deleteFolder(pathFolder)).toEqual(true);
  });

  it("should create laporan keuangan bad request tanggal not suitable jenis_laporan", async () => {
    // create laporan keuangan
    sendCreateLaporanKeuangan.jenis_laporan = "Q1"; // harus nya tahunan
    sendCreateLaporanKeuangan.tanggal = "2022-09-30"; // harus nya 2022-12-31
    const {
      kode_emiten,
      tanggal,
      jenis_laporan,
      harga_saham,
      aset,
      kas_dan_setara_kas,
      piutang,
      persediaan,
      aset_lancar,
      aset_tidak_lancar,
      liabilitas_jangka_pendek,
      liabilitas_jangka_panjang,
      liabilitas_berbunga,
      ekuitas,
      pendapatan,
      laba_kotor,
      laba_usaha,
      beban_bunga,
      laba_sebelum_pajak,
      laba_bersih,
      operasi,
      investasi,
      pendanaan,
    } = sendCreateLaporanKeuangan;
    const response = await request(app)
      .post("/laporan-keuangan")
      .set("Accept", "application/json")
      .set("Authorization", tokenAdmin)
      .set("Content-Type", "multipart/form-data")
      .field("tanggal", tanggal)
      .field("kode_emiten", kode_emiten)
      .field("jenis_laporan", jenis_laporan)
      .field("harga_saham", harga_saham)
      .field("aset", aset)
      .field("kas_dan_setara_kas", kas_dan_setara_kas)
      .field("piutang", piutang)
      .field("persediaan", persediaan)
      .field("aset_lancar", aset_lancar)
      .field("aset_tidak_lancar", aset_tidak_lancar)
      .field("liabilitas_jangka_pendek", liabilitas_jangka_pendek)
      .field("liabilitas_jangka_panjang", liabilitas_jangka_panjang)
      .field("liabilitas_berbunga", liabilitas_berbunga)
      .field("ekuitas", ekuitas)
      .field("pendapatan", pendapatan)
      .field("laba_kotor", laba_kotor)
      .field("laba_usaha", laba_usaha)
      .field("beban_bunga", beban_bunga)
      .field("laba_sebelum_pajak", laba_sebelum_pajak)
      .field("laba_bersih", laba_bersih)
      .field("operasi", operasi)
      .field("investasi", investasi)
      .field("pendanaan", pendanaan)
      .attach("nama_file", __dirname + "/test.pdf")
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        errors: expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              value: tanggal,
              msg: response.body.errors.errors[0].msg,
            }),
          ]),
        }),
      })
    );
  });
});

describe("GET /laporan-keuangan/:kode_emiten/:tanggal", () => {
  it("should find laporan keuangan success", async () => {
    const { kode_emiten } = sendCreateEmiten;
    const tanggal = "2021-03-31";
    const { jenis_laporan } = sendCreateLaporanKeuangan;
    const response = await request(app)
      .get(`/laporan-keuangan/${kode_emiten}/${tanggal}`)
      .set("Accept", "application/json")
      .set("Authorization", tokenUser)
      .expect(200);
    const nama_file = `${kodeEmiten} ${jenis_laporan} ${formatTanggal(
      tanggal
    )}.pdf`;
    const replacePublic = LOCATION_LAPORAN_KEUANGAN.split("/")[1];
    const download = `${HOST}:${PORT}/${replacePublic}/${jenis_laporan}/${kode_emiten}/${nama_file}`;
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        data: expect.objectContaining({
          nama_file,
          jenis_laporan,
          download,
        }),
      })
    );
  });
});

describe("DELETE /laporan-keuangan", () => {
  it("should delete laporan keuangan success", async () => {
    // cari id laporan_keuangan yang sudah di buat
    const laporanKeuangan = await LaporanKeuangan.findOne({
      where: {
        harga_saham: sendCreateLaporanKeuangan.harga_saham,
      },
    });
    const response = await request(app)
      .delete(`/laporan-keuangan/${laporanKeuangan.id}`)
      .set("Accept", "application/json")
      .set("Authorization", tokenAdmin)
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        message: response.body.message,
      })
    );
  });
});
