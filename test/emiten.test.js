const request = require('supertest');
const app = require('../app');
const randomAlphabert = require('../helper/random_alphabert');
const kodeEmiten = randomAlphabert(4);
const send = {
  jumlah_saham: 200000000,
  kode_emiten: kodeEmiten,
  nama_emiten: `PT ${kodeEmiten} AGRO LESTARI TBK`
}

describe('POST /emiten', () => {
  it('should create emiten success', async () => {
    const { jumlah_saham, kode_emiten, nama_emiten } = send;
    
    const response =  await request(app)
      .post('/emiten')
      .set('Accept', 'application/json')
      .send({
        jumlah_saham,
        kode_emiten,
        nama_emiten
      }).expect(201);
    expect(response.body).toEqual(expect.objectContaining({
      status: 'success',
      message: response.body.message
    }));
  });

  it('should failed create emiten bad request kode emiten must be 4 letters', async () => {
    const { jumlah_saham, nama_emiten } = send;
    const response = await request(app)
      .post('/emiten')
      .set('Accept', 'application/json')
      .send({
        jumlah_saham,
        kode_emiten: 'ERROR',
        nama_emiten 
      }).expect(400);
    expect(response.body).toEqual(expect.objectContaining({
      errors: expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            value: 'ERROR',
            msg: "kode emiten must be 4 letters"
          })
        ])
      })
    }));
  });
});

describe('GET /emiten', () => {
  it('should get emiten success', async () => {
    const response = await request(app)
      .get('/emiten')
      .set('Accept', 'application/json')
      .expect(200);
    expect(response.body).toEqual(expect.objectContaining({
      status: 'success'
    }));
  });
  it('should get emiten success query params', async () => {
    const { jumlah_saham, kode_emiten, nama_emiten } = send;
    const response = await request(app)
      .get(`/emiten?kode_emiten=${kode_emiten}&nama_emiten=${nama_emiten}&page=1&per_page=1`)
      .set('Accept', 'application/json')
      .expect(200);
    expect(response.body).toEqual(expect.objectContaining({
      status: 'success',
      data: expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            jumlah_saham,
            kode_emiten,
            nama_emiten
          })
        ])
      })
    }));
  });
});

describe('PUT /emiten', () => {
  it('should update emiten success', async () => {
    const getEmiten = await request(app)
    .get('/emiten')
    .set('Accept', 'application/json')
    .expect(200);
    
    const updateKodeEmiten = randomAlphabert(4);
    const update = {
      jumlah_saham: 2000000000,
      kode_emiten: updateKodeEmiten,
      nama_emiten: `PT ${updateKodeEmiten} AGRO LESTARI TBK`
    }
    const { id } = getEmiten.body.data.data[0];

    const updateEmiten = await request(app)
      .put(`/emiten/${id}`)
      .set('Accept', 'application/json')
      .send(update).expect(200);
    
    expect(updateEmiten.body).toEqual(expect.objectContaining({
      status: 'success',
      message: updateEmiten.body.message
    }));

    const getUpdateEmiten = await request(app)
      .get(`/emiten?kode_emiten=${updateKodeEmiten}&jumlah_saham=${update.jumlah_saham}&nama_emiten=${update.nama_emiten}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(getUpdateEmiten.body).toEqual(expect.objectContaining({
      status: 'success',
      data: expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            id,
            kode_emiten: updateKodeEmiten,
            jumlah_saham: update.jumlah_saham,
            nama_emiten: update.nama_emiten
          })
        ])
      })
    }));
  });

  it('should failed update emiten bad request kode emiten must be 4 letters', async () => {
  
    const getEmiten = await request(app)
      .get('/emiten')
      .set('Accept', 'application/json')
      .expect(200);

    const { id } = getEmiten.body.data.data[0];
    
    const updateKodeEmitenFailed = 'ABCDE';
    send.kode_emiten = updateKodeEmitenFailed;
    const response = await request(app)
      .put(`/emiten/${id}`)
      .set('Accept', 'application/json')
      .send(send)
      .expect(400);
    
    expect(response.body).toEqual(expect.objectContaining({
      errors: expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            value: send.kode_emiten,
            msg: "kode emiten must be 4 letters"
          })
        ])
      })
    }));
  });
});