module.exports = (kodeEmiten) => {
  var validasiHuruf = /^[a-zA-Z ]+$/;
  if (kodeEmiten.match(validasiHuruf) && kodeEmiten.length === 4) {
     return true;
  } 
  throw new Error("kode emiten must be 4 letters");
}