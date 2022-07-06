const MOS = require("./MOS");

function potensiUpside(nilaiSaatIni, nilaiIntrinsik) {
  return (
    (((nilaiIntrinsik - nilaiSaatIni) / nilaiSaatIni) * 100).toFixed(2) + "%"
  );
}

const nilaiSaatIni = 7500;
const nilaiIntrinsik = 15000;
const nilaiDownSide = 6000;
console.log(`Capital Gain ${potensiUpside(nilaiSaatIni, nilaiIntrinsik)}`);
console.log(`Margin Of Safety ${MOS(nilaiSaatIni, nilaiIntrinsik)}`);
console.log(`Capital Loss ${potensiUpside(nilaiSaatIni, nilaiDownSide)}`);
