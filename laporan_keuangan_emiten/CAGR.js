function CAGR(nilaiAwal, nilaiAkhir) {
  return (((nilaiAkhir / nilaiAwal) ** 0.25 - 1) * 100).toFixed(2) + "%";
}

console.log(CAGR(2559.9, 2834.3));

// console.log("INKP");
// console.log(`ASET ${CAGR(92423556800000, 128113521489450)}`);
// console.log(`EKUITAS ${CAGR(37875963076000, 67894789112990)}`);

// console.log(`PENDAPATAN ${CAGR(36552275228000, 50178200799860)}`);
// console.log(`LABA BERSIH ${CAGR(2723544380000, 7520895521790)}`);
// console.log(`ARUS KAS OPERASI ${CAGR(2203450256000, 9683877671650)}`);

// console.log(`BOOK VALUE ${CAGR(6923.06, 12409.98)}`);
// console.log(`EPS ${CAGR(497.82, 1374.69)}`);
