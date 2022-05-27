module.exports = (dataLaporanKeuangan = [], jumlah_saham, jenis_laporan) => {
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
      ICR: [],
    },
    profitabilitas: {
      GPM: [],
      OPM: [],
      NPM: [],
      ROE: [],
      ROA: [],
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
  if (dataLaporanKeuangan.length === 0) return null;
  if (jenis_laporan === "TAHUNAN") {
    dataResponse.dividen = {
      tanggal: [],
      DPS: [],
      DY: [],
      DPR: [],
    };
  }
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
        persediaan,
        liabilitas_jangka_pendek,
        liabilitas_jangka_panjang,
        liabilitas_berbunga,
        ekuitas,
      } = neraca_keuangan;
      const { pendapatan, laba_kotor, laba_usaha, beban_bunga, laba_bersih } =
        laba_rugi;

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
      const netGearingRasio = rasio(liabilitas_berbunga, ekuitas);
      const interestCoverageRasio = rasio(laba_usaha, beban_bunga * -1, "x"); // convert beban bunga jadi positif

      dataResponse.solvabilitas.DER.push(deptToEquityRasio);
      dataResponse.solvabilitas.NGR.push(netGearingRasio);
      dataResponse.solvabilitas.ICR.push(interestCoverageRasio);

      // isi data response profitabilitas
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
      const { operasi } = arus_kas;
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

      dataResponse.valuasi.BVPS.push(bookValuePerShare.toFixed(2));
      dataResponse.valuasi.PBV.push(priceToBookValue);

      dataResponse.valuasi.RPS.push(revenuePerShare.toFixed(2));
      dataResponse.valuasi.PS.push(priceToSalesRasio);

      dataResponse.valuasi["EV/EBITDA"].push(enterPriceValue);

      dataResponse.valuasi.EPS.push(earningPerShare.toFixed(2));
      dataResponse.valuasi.PER.push(priceEarningRasio);

      dataResponse.valuasi.CFPS.push(cashflowPerShare.toFixed(2));
      dataResponse.valuasi.PCF.push(priceToCashflowRasio);

      // cek jenis laporan harus TAHUNAN
      if (dividen && jenis_laporan === "TAHUNAN") {
        // isi data response dividen
        const { cash } = dividen;
        const dividenYield = rasio(cash, harga_saham);
        const dividenPayoutRasio = rasio(jumlah_saham * cash, laba_bersih);

        dataResponse.dividen.tanggal.push(tanggal);
        dataResponse.dividen.DPS.push(cash);
        dataResponse.dividen.DY.push(dividenYield);
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
