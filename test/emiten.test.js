const request = require('supertest');
const app = require('../app');


describe('POST /emiten', () => {
  it('should create emiten', async () => {
    const response =  await request(app)
      .post('/emiten')
      .set('Accept', 'application/json')
      .send({
        jumlah_saham: 200000000,
        kode_emiten: "AALI",
        nama_emiten: "PT ASTRA AGRO LESTARI TBK"
    }).expect(200);
    expect(response.body).toEqual(expect.objectContaining({
      status: 'success'
    }));
  });
});