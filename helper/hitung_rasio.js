module.exports = (dataLaporanKeuangan, jumlah_saham, jenis_laporan) => {
  // format response data yang dikirimkan
  const dataResponse = {
    tanggal: [],
    harga_saham: [],
    likuiditas: {
      CRR: [],
      QR: [],
      CR: [],
    },
    solvabilitas: {
      DER: [],
      NGR: [],
    },
    profitabilitas: {
      GPM: [],
      OPM: [],
      NPM: [],
      ROE: [],
      ROA: [],
    },
    dividen: {
      tanggal: [],
      DPS: [],
      yield: [],
      DPR: [],
    },
    valuasi: {
      BVPS: [],
      PBV: [],
      "EV/EBITDA": [],
      RPS: [],
      PS: [],
      EPS: [],
      PER: [],
      CFPS: [],
      PCF: [],
    },
  };
  dataLaporanKeuangan.forEach(
    ({
      tanggal,
      harga_saham,
      neraca_keuangan,
      laba_rugi,
      arus_kas,
      dividen,
    }) => {
      // isi data response
      dataResponse.tanggal.push(tanggal);
      dataResponse.harga_saham.push(harga_saham);

      // isi data response likuiditas
      const {
        aset,
        aset_lancar,
        kas_dan_setara_kas,
        piutang,
        persediaan,
        aset_tidak_lancar,
        liabilitas_jangka_pendek,
        liabilitas_jangka_panjang,
        liabilitas_berbunga,
        ekuitas,
      } = neraca_keuangan;
      const currentRasio = rasio(aset_lancar, liabilitas_jangka_pendek);
      const quickRasio = rasio(
        aset_lancar - persediaan,
        liabilitas_jangka_pendek
      );
      const cashRasio = rasio(kas_dan_setara_kas, liabilitas_jangka_pendek);
      dataResponse.likuiditas.CRR.push(currentRasio);
      dataResponse.likuiditas.QR.push(quickRasio);
      dataResponse.likuiditas.CR.push(cashRasio);

      // isi data response solvabilitas
      const deptToEquityRasio = rasio(
        liabilitas_jangka_pendek + liabilitas_jangka_panjang,
        ekuitas
      );
      dataResponse.solvabilitas.DER.push(deptToEquityRasio);
      const netGearingRasio = rasio(liabilitas_berbunga, ekuitas);
      dataResponse.solvabilitas.NGR.push(netGearingRasio);

      // isi data response profitabilitas
      const {
        pendapatan,
        laba_kotor,
        laba_usaha,
        laba_sebelum_pajak,
        laba_bersih,
      } = laba_rugi;
      const grossProfitMargin = rasio(laba_kotor, pendapatan);
      const operatingProfitMargin = rasio(laba_usaha, pendapatan);
      const netProfitMargin = rasio(laba_bersih, pendapatan);
      const returnOnAset = rasio(laba_bersih, aset);
      const returnOnEquity = rasio(laba_bersih, ekuitas);

      dataResponse.profitabilitas.GPM.push(grossProfitMargin);
      dataResponse.profitabilitas.OPM.push(operatingProfitMargin);
      dataResponse.profitabilitas.NPM.push(netProfitMargin);
      dataResponse.profitabilitas.ROA.push(returnOnAset);
      dataResponse.profitabilitas.ROE.push(returnOnEquity);

      // isi data response valuasi
      const { operasi, investasi, pendanaan } = arus_kas;
      const bookValuePerShare = ekuitas / jumlah_saham;
      const priceToBookValue = rasio(harga_saham, bookValuePerShare, "x");

      const revenuePerShare = pendapatan / jumlah_saham;
      const priceToSalesRasio = rasio(harga_saham, revenuePerShare, "x");

      const enterPriceValue = rasio(
        jumlah_saham * harga_saham,
        laba_usaha,
        "x"
      );

      const earningPerShare = laba_bersih / jumlah_saham;
      const priceEarningRasio = rasio(harga_saham, earningPerShare, "x");

      const cashflowPerShare = operasi / jumlah_saham;
      const priceToCashflowRasio = rasio(harga_saham, cashflowPerShare, "x");

      dataResponse.valuasi.BVPS.push(bookValuePerShare);
      dataResponse.valuasi.PBV.push(priceToBookValue);

      dataResponse.valuasi.RPS.push(revenuePerShare);
      dataResponse.valuasi.PS.push(priceToSalesRasio);

      dataResponse.valuasi["EV/EBITDA"].push(enterPriceValue);

      dataResponse.valuasi.EPS.push(earningPerShare);
      dataResponse.valuasi.PER.push(priceEarningRasio);

      dataResponse.valuasi.CFPS.push(cashflowPerShare);
      dataResponse.valuasi.PCF.push(priceToCashflowRasio);

      // cek jenis laporan harus TAHUNAN
      if (dividen && jenis_laporan === "TAHUNAN") {
        // isi data response dividen
        const { cash } = dividen;
        const yield = rasio(cash, harga_saham);
        const dividenPayoutRasio = rasio(jumlah_saham * cash, laba_bersih);

        dataResponse.dividen.tanggal.push(tanggal);
        dataResponse.dividen.DPS.push(cash);
        dataResponse.dividen.yield.push(yield);
        dataResponse.dividen.DPR.push(dividenPayoutRasio);
      }
    }
  );
  return dataResponse;
};
function rasio(num1, num2, type = "%") {
  if (type === "x") {
    return (num1 / num2).toFixed(2) + "x";
  }
  return ((num1 / num2) * 100).toFixed(2) + "%";
}
