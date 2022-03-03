function CAGR(nilaiAwal, nilaiAkhir) {
  return ((nilaiAkhir / nilaiAwal) ** 0.25 - 1) * 100;
}

console.log(CAGR(394.70, 694.40));