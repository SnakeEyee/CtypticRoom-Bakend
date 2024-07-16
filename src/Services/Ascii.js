async function A_Encrypt(message) {
  var encrypted = "";
  for (var i = 0; i < message.length; i++) {
    encrypted += message.charCodeAt(i) + " ";
  }
  return encrypted.trim();
}

async function A_Decrypt(message) {
  var decrypted = "";
  var asciiValues = message.split(" ");
  for (var i = 0; i < message.length; i++) {
    decrypted += String.fromCharCode(parseInt(asciiValues[i]));
  }
  return decrypted;
}

module.exports = { A_Encrypt, A_Decrypt };
