module.exports = (kodeEmiten) => {
  const aplhabert = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
                  'J','K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                ];
  if (kodeEmiten.length === 4) {
    for (const huruf of kodeEmiten.split('')) {
     if (!aplhabert.includes(huruf.toUpperCase())) {
       throw new Error('kode emiten is invalid');
     }
    }
    return true;
  }
  throw new Error("kode emiten must be 4 letters");
}