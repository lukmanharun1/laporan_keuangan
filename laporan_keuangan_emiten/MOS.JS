function MOS(nilaiSaatIni, nilaiIntrinsik) {
  return ((nilaiIntrinsik - nilaiSaatIni) / nilaiIntrinsik * 100).toFixed(2) + '%';
}

console.log(MOS(7775, 12064.29));