async function C_Encrypt(key, message) {
  let encrypted = "";
  for (var i = 0; i < message.length; i++) {
    var charCode = message.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      encrypted += String.fromCharCode(((charCode - 65 + key) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      encrypted += String.fromCharCode(((charCode - 97 + key) % 26) + 97);
    } else {
      encrypted += message.charAt(i);
    }
  }
  return encrypted;
}

async function C_Decrypt(key, message) {
  let decrypted = "";
  for (var i = 0; i < message.length; i++) {
    var charCode = message.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      decrypted += String.fromCharCode(((charCode - 65 - key + 26) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      decrypted += String.fromCharCode(((charCode - 97 - key + 26) % 26) + 97);
    } else {
      decrypted += message.charAt(i);
    }
  }
  return decrypted;
}

module.exports = { C_Encrypt, C_Decrypt };
