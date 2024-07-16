async function B_Encrypt(message) {
  var encrypted = "";
  for (var i = 0; i < message.length; i++) {
    let binaryChar = message.charCodeAt(i).toString(2);
    binaryChar = "0".repeat(8 - binaryChar.length) + binaryChar;
    encrypted += binaryChar;
  }
  return encrypted;
}

async function B_Decrypt(message) {
  var decrypted = "";
  for (var i = 0; i < message.length; i += 8) {
    var binaryChar = message.substr(i, 8);
    var charCode = parseInt(binaryChar, 2);
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}

module.exports = { B_Encrypt, B_Decrypt };
