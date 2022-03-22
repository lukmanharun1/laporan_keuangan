module.exports = (n) => {
  let emptyString = "";
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  while (emptyString.length < n) {
    emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return emptyString;
}