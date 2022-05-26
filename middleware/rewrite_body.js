module.exports = (req, res, next) => {
  const { rewriteBody, body } = req;
  if (rewriteBody?.laba_rugi && rewriteBody?.arus_kas) {
    const {
      pendapatan,
      laba_kotor,
      laba_usaha,
      beban_bunga,
      laba_sebelum_pajak,
      laba_bersih,
    } = rewriteBody.laba_rugi;
    const { operasi, investasi, pendanaan } = rewriteBody.arus_kas;
    body.pendapatan -= pendapatan;
    body.laba_kotor -= laba_kotor;
    body.laba_usaha -= laba_usaha;
    body.beban_bunga -= beban_bunga;
    body.laba_sebelum_pajak -= laba_sebelum_pajak;
    body.laba_bersih -= laba_bersih;

    body.operasi -= operasi;
    body.investasi -= investasi;
    body.pendanaan -= pendanaan;
  }
  return next();
};
