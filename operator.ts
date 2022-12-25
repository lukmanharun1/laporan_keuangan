import readline from 'readline'
import process, { stdin, stdout as output } from 'process';

const rl = readline.createInterface({ input: stdin, output });


let total: number = 0;
(async () => {
    total = convertNumber(await input('Masukkan angka terlebih dahulu '))
    while (true) {
        console.log('1. penjumlahan');
        console.log('2. pengurangan');
        console.log('0. keluar');

        const nomor: number = parseInt(await input('Pilih nomor '))
        if (nomor === 1) {
            await hitungTotal('+')
        } else if (nomor === 2) {
            await hitungTotal('-')
        }
        else {
            console.log('Terima kasih')
            process.exit(nomor)
        }
    }
})()


type Operator = '+' | '-';
async function hitungTotal(operator: Operator, question: string = 'Masukkan angka dilaporan keuangan atau reset dan ganti nomor[y]?') {
    while (true) {
        let angka: string = await input(question)
        if (angka === 'y') {
            total = 0;
            console.log('ok')
            break;
        }
        if (operator === '-') {
            total -= convertNumber(angka)
        } else if (operator === '+') {
            total += convertNumber(angka)
        }
        console.log(total)
        console.log(formatLaporanKeuangan(total))
    }
}

function convertNumber(str: string): number {
    // remove dot (.)
    str = str.split('.').join('').split(',').join('')
    console.log(str)
    // remove (
    if (str.includes('(')) {
        // angka minus
        str = `-${str.replace('(', '')}`;
    }
    return parseInt(str) || 0
}
function formatLaporanKeuangan(num: number): string | number {
    if (num <= 1_000_000_0 && num > 0) return num;
    const resultM = num / 1_000_000_000;
    const resultT = resultM / 1000;

    if (resultM < 0) {
        if (resultM <= -1000) {
            return `(${(resultT * -1).toFixed(2)} T)`
        }
        return `(${(resultM * -1).toFixed(2)} M)`
    }

    if (resultT >= 1) {
        return `${resultT.toFixed(2)} T`;
    }
    return `${resultM.toFixed(2)} M`;
}

function input(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer: string) => {
            resolve(answer)
        })
    })
}