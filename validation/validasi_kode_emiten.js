module.exports = (kodeEmiten) => {
  var validasiHuruf = /^[a-zA-Z ]+$/;
  if (kodeEmiten.match(validasiHuruf) && kodeEmiten.length === 4) {
     return true;
  } 
  throw new Error("kode emiten harus 4 huruf");
}