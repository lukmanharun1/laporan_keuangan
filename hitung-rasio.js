const { saham_beredar, harga_saham, tanggal, neraca, laba_rugi, arus_kas, satuan, pembagian, dividen } = require('./data.json')


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

let { ekuitas, total_liabilitas, aset_lancar, liabilitas_lancar, persediaan, liabilitas_berbunga, kas_dan_setara_kas } = neraca;

ekuitas *= satuan;
total_liabilitas *= satuan;
aset_lancar *= satuan;
liabilitas_lancar *= satuan;
persediaan *= satuan;
liabilitas_berbunga *= satuan;
kas_dan_setara_kas *= satuan;

const aset = ekuitas + total_liabilitas;
let { pendapatan, laba_kotor, laba_operasional, laba_bersih } = laba_rugi;

pendapatan *= satuan * pembagian;
laba_kotor *= satuan * pembagian;
laba_operasional *= satuan * pembagian;
laba_bersih *= satuan * pembagian;

let { aktivitas_operasi, aktivitas_investasi, aktivitas_pendanaan } = arus_kas;

aktivitas_operasi *= satuan * pembagian;
aktivitas_investasi *= satuan * pembagian;
aktivitas_pendanaan *= satuan * pembagian;


const result = {
    harga_saham,
    tanggal,
    neraca: {
        kas_dan_setara_kas,
        aset_lancar,
        aset,
        liabilitas_berbunga,
        persediaan,
        liabilitas_lancar,
        total_liabilitas,
        ekuitas
    },
    labar_rugi: {
        pendapatan,
        laba_kotor,
        laba_operasional,
        laba_bersih
    },
    arus_kas: {
        aktivitas_operasi,
        aktivitas_investasi,
        aktivitas_pendanaan
    },
    rasio: {
        profitabilitas: {},
        valuasi: {},
        solvabilitas: {},
        likuiditas: {}
    }
}



// profitabilitas
const ROA = ratio(laba_bersih, aset);
const ROE = ratio(laba_bersih, ekuitas);
const GPM = ratio(laba_kotor, pendapatan);
const OPM = ratio(laba_operasional, pendapatan);
const NPM = ratio(laba_bersih, pendapatan);

result.rasio.profitabilitas = {
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
const PS = divide(harga_saham, RPS) + 'x';

const CFPS = divide(aktivitas_operasi, saham_beredar);
const PCF = divide(harga_saham, CFPS) + 'x';

const EPS = divide(laba_bersih, saham_beredar);
const PER = divide(harga_saham, EPS) + 'x';

result.rasio.valuasi = {
    BVPS,
    PBV,
    RPS,
    PS,
    CFPS,
    PCF,
    EPS,
    PER
}

// solvabilitas
const DER = `${ratio(total_liabilitas, ekuitas)} | ${ratio(liabilitas_berbunga, ekuitas)}`;
const DAR = ratio(total_liabilitas, aset);

result.rasio.solvabilitas = {
    DER,
    DAR
}

// likuiditas
const CRR = ratio(aset_lancar, liabilitas_lancar);
const QR = ratio(aset_lancar - persediaan, liabilitas_lancar);
const CR = ratio(kas_dan_setara_kas, liabilitas_lancar);

result.rasio.likuiditas = {
    CRR,
    QR,
    CR
}

if (dividen) {
    const { DPS, cumulative_date, ex_date, recording_date, payment_date } = dividen;

    const DPR = ratio(saham_beredar * DPS, laba_bersih);
    const DY = ratio(DPS, harga_saham);

    result.dividen = {
        cumulative_date,
        ex_date,
        recording_date,
        payment_date
    }
    result.rasio.dividen = {
        DPS,
        DY,
        DPR
    }
}

console.log(JSON.stringify(result, null, 2));