module.exports = (value, { req }) => {
  if (!value) {
    throw new Error("tanggal wajib di isi");
  }
  const [tahun, bulan, tanggal] = value.split("-");
  // cek tanggal khusus tanggal 30, 31

  // cek bulan khusus 3 -> Q1, 6 -> Q2, 9 -> Q3, 12 -> TAHUNAN
  const { jenis_laporan } = req.body;
  if (
    (tanggal == 31 && bulan == 3 && jenis_laporan == "Q1") ||
    (tanggal == 30 && bulan == 6 && jenis_laporan == "Q2") ||
    (tanggal == 30 && bulan == 9 && jenis_laporan == "Q3") ||
    (tanggal == 31 && bulan == 12 && jenis_laporan == "TAHUNAN")
  ) {
    return true;
  }
  throw new Error("Tanggal tidak cocok dengan jenis laporan");
};
