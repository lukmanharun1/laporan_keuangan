function MOS(nilaiSaatIni, nilaiIntrinsik) {
  return (
    (((nilaiIntrinsik - nilaiSaatIni) / nilaiIntrinsik) * 100).toFixed(2) + "%"
  );
}

module.exports = MOS;
