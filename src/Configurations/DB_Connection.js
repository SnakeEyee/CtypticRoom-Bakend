const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoURI = process.env.MONGO_URI;
async function ConnectToDataBase() {
  try {
    await mongoose.connect(mongoURI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    return console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:\n", error);
  }
}

module.exports = ConnectToDataBase;
