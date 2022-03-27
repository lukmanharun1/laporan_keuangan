function hitungDividen(hargaSaham, labaBersih, jumlahSahamBeredar) {
  // asumsi Divden Payout Rasio 5% + 5%
  let bersih = labaBersih;
  let DPR = 5;
  for (let i = 0; i < 20; i++) {
    labaBersih = parseInt(bersih * (DPR / 100));
    const DPS = parseFloat(labaBersih / jumlahSahamBeredar).toFixed(2);
    const yield = parseFloat(DPS / hargaSaham * 100).toFixed(2);
    console.log(`Rp.${DPS} yield ${yield}% DPR ${parseInt(DPR)}%`);
    DPR += 5;
  }
}

hitungDividen(28000, 6785908330000, 1129925000);