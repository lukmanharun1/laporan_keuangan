module.exports = (date) => {
  let [tahun, bulan, tanggal] = date.split('-');
  if (bulan == '03') {
      bulan = "MARET";
  } else if (bulan == '06') {
    bulan = "JUNI";
  } else if (bulan == '09') {
    bulan = "SEPTEMBER";
  } else if (bulan == '12') {
    bulan = "DESEMBER";
  }
  return `${tanggal} ${bulan} ${tahun}`;
}