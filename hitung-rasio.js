const { saham_beredar, harga_saham, neraca, laba_rugi, arus_kas } = require('./data.json')

function ratio(number1, number2) {
    return format((number1 / number2) * 100);
}

function format(number) {
    return parseFloat(parseFloat(number).toFixed(2));
}

// inisialisasi

const { ekuitas, liabilitas, aset_lancar, liabilitas_lancar, persediaan, aset } = neraca;
const { pendapatan, laba_kotor, laba_operasional, laba_bersih } = laba_rugi;
const { aktivitas_operasi, aktivitas_investasi, aktivitas_pendanaan, kas_dan_setara_kas } = arus_kas;

// profitabilitas
const roa = ratio(laba_bersih, aset);
const roe = ratio(laba_bersih, ekuitas);
const gpm = ratio(laba_kotor, pendapatan);
const opm = ratio(laba_operasional, pendapatan);
const npm = ratio(laba_bersih, pendapatan);

// valuasi
