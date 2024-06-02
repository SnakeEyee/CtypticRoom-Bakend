function Generate_key() {
  return Math.floor(Math.random() * 24) + 2;
}

module.exports = { Generate_key };
