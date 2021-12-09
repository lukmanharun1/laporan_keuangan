const { saham_beredar, harga_saham, neraca, laba_rugi, arus_kas, dividen } = require('./data.json')

function divide(number1, number2) {
    return format(number1 / number2);
}
function ratio(number1, number2) {
    return format((number1 / number2) * 100) + '%';
}

function format(number) {
    return number.toFixed(2);
}

// inisialisasi

const { ekuitas, liabilitas, aset_lancar, liabilitas_lancar, persediaan, aset } = neraca;
const { pendapatan, laba_kotor, laba_operasional, laba_bersih } = laba_rugi;
const { aktivitas_operasi, aktivitas_investasi, aktivitas_pendanaan, kas_dan_setara_kas } = arus_kas;
const cashflow = aktivitas_operasi + aktivitas_investasi + aktivitas_pendanaan;
const result = {
    profitabilitas: {},
    valuasi: {},
    solvabilitas: {},
    likuiditas: {}
}

// profitabilitas
const ROA = ratio(laba_bersih, aset);
const ROE = ratio(laba_bersih, ekuitas);
const GPM = ratio(laba_kotor, pendapatan);
const OPM = ratio(laba_operasional, pendapatan);
const NPM = ratio(laba_bersih, pendapatan);

result.profitabilitas = {
    ROA,
    ROE,
    GPM,
    OPM,
    NPM
}
// valuasi
const BVPS = divide(ekuitas, saham_beredar);
const PBV = divide(harga_saham, BVPS) + 'x';
const RPS = divide(pendapatan, saham_beredar);

const CFPS = divide(cashflow - dividen, saham_beredar);
const PCF = divide(harga_saham, CFPS) + 'x';

const EPS = divide(laba_bersih, saham_beredar);
const PER = divide(harga_saham, EPS) + 'x';

result.valuasi = {
    BVPS,
    PBV,
    RPS,
    CFPS,
    PCF,
    EPS,
    PER
}

// solvabilitas
const DER = ratio(liabilitas, ekuitas);
const DAR = ratio(liabilitas, aset);

result.solvabilitas = {
    DER,
    DAR
}


// likuiditas
const CR = ratio(aset_lancar, liabilitas_lancar);
const QR = ratio(aset_lancar - persediaan, liabilitas_lancar);
const KR = ratio(kas_dan_setara_kas, liabilitas_lancar);

result.likuiditas = {
    CR,
    QR,
    KR
}

console.log(JSON.stringify(result, null, 2));

