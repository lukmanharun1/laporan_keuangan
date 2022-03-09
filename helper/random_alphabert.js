module.exports = (n) => {
  let emptyString = "";
  let alphabet = "ABCDEFGHIJKLMN0PQRSTUVWXYZ";
  while (emptyString.length < n) {
    emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return emptyString;
}