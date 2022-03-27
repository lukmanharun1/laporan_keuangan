const request = require('supertest');
const app = require('../app');
const randomAlphabert = require('../helper/random_alphabert');
const cekFile = require('../helper/cek_file');
const hapusFile = require('../helper/hapus_file');
const formatTanggal = require('../helper/format_tanggal');

describe('GET /arus-kas/:emiten_id/:jenis_laporan', () => {
  it('should find arus kas success', async () => {
    // create emiten terlebih dahulu
    const jumlah_saham = 200000000;
    const kode_emiten = randomAlphabert(4);
    const nama_emiten = `PT ${kode_emiten} AGRO LESTARI TBK`;

    await request(app)
    .post('/emiten')
    .set('Accept', 'application/json')
    .send({
      jumlah_saham,
      kode_emiten,
      nama_emiten
    })
    .expect(201);
    
    // cari emiten yang sudah di create
    const getEmiten = await request(app)
      .get('/emiten')
      .query({
        kode_emiten,
        nama_emiten,
        page: 1,
        per_page: 1
      })
      .set('Accept', 'application/json')
      .expect(200);

    // create laporan keuangan
    const dataLaporanKeuangan = {
      emiten_id: getEmiten.body.data.data[0].id,
      tanggal: '2021-03-31',
      jenis_laporan: 'Q1',
      harga_saham: 3300,
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
      laba_sebelum_pajak: 1000000,
      laba_bersih: 1000000,
      operasi: 1000000,
      investasi: 1000000,
      pendanaan: 1000000,
    }

    const { emiten_id, tanggal, jenis_laporan, harga_saham, aset,
      kas_dan_setara_kas, piutang, persediaan, aset_lancar,
      aset_tidak_lancar, liabilitas_jangka_pendek,
      liabilitas_jangka_panjang, liabilitas_berbunga,
      ekuitas, pendapatan, laba_kotor, laba_usaha,
      laba_sebelum_pajak, laba_bersih,
      operasi, investasi, pendanaan } = dataLaporanKeuangan;
    const laporanKeuangan = await request(app)
      .post('/laporan-keuangan')
      .set('Accept', 'application/json')
      .set('Content-Type', 'multipart/form-data')
      .field('tanggal', tanggal)
      .field('emiten_id', emiten_id)
      .field('jenis_laporan', jenis_laporan)
      .field('harga_saham', harga_saham)
      .field('aset', aset)
      .field('kas_dan_setara_kas', kas_dan_setara_kas)
      .field('piutang', piutang)
      .field('persediaan', persediaan)
      .field('aset_lancar', aset_lancar)
      .field('aset_tidak_lancar', aset_tidak_lancar)
      .field('liabilitas_jangka_pendek', liabilitas_jangka_pendek)
      .field('liabilitas_jangka_panjang', liabilitas_jangka_panjang)
      .field('liabilitas_berbunga', liabilitas_berbunga)
      .field('ekuitas', ekuitas)
      .field('pendapatan', pendapatan)
      .field('laba_kotor', laba_kotor)
      .field('laba_usaha', laba_usaha)
      .field('laba_sebelum_pajak', laba_sebelum_pajak)
      .field('laba_bersih', laba_bersih)
      .field('operasi', operasi)
      .field('investasi', investasi)
      .field('pendanaan', pendanaan)
      .attach('nama_file', __dirname + '/test.pdf')
      .expect(201);

      // cek file apakah berhasil di upload
      const nama_file = `${kode_emiten} ${jenis_laporan} ${formatTanggal(tanggal)}.pdf`;
      const pathFile = `public/laporan_keuangan/${jenis_laporan}/${nama_file}`;

      expect(cekFile(pathFile)).toEqual(true);
      expect(laporanKeuangan.body).toEqual(expect.objectContaining({
        status: 'success',
        message: laporanKeuangan.body.message
      }));

      // hapus file karena untuk test saja
      hapusFile(pathFile);

    // cari arus kas
    const arusKas = await request(app)
      .get(`/arus-kas/${emiten_id}/${jenis_laporan}`)
      .set('Accept', 'application/json')
      .expect(200);
    
      expect(arusKas.body).toEqual(expect.objectContaining({
        status: 'success',
        data: expect.arrayContaining([
          expect.objectContaining({
            nama_file,
            arus_kas: expect.objectContaining({
              operasi,
              investasi,
              pendanaan,
            })
          })    
        ])
      }));
  });
});