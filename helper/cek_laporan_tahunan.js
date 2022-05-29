module.exports = (findLaporanKeuangan, tahunKuartal) => {
  let status = false;
  findLaporanKeuangan.find((data) => {
    const TAHUNAN = data.tanggal.toISOString().split("-")[0];
    if (data.jenis_laporan === "TAHUNAN" && tahunKuartal === TAHUNAN) {
      status = true;
      return;
    }
  });
  return status;
};
