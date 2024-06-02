const Rooms = require("../Models/Rooms");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const GeminiGen = require("../Configurations/GenAI");
const Messages = require("../Models/Messages");
const { Generate_key } = require("../Utilities/key_gen");
const jwt = require("jsonwebtoken");
const { A_Decrypt } = require("../Services/Ascii");
const { B_Decrypt } = require("../Services/Binary");
const { C_Decrypt } = require("../Services/Caeser");

dotenv.config();

async function Create_room(req, res) {
  const costFactor = parseInt(process.envCOST_FACTOR);
  const secret_key = process.env.SECRET_KEY;

  try {
    const room_name = await GeminiGen();
    const { Room_Admin, Room_Enc_Type, Room_Password } = req.body;
    const hashedPass = await bcrypt.hash(Room_Password, costFactor);

    var Room_Key;
    if (Room_Enc_Type === "Caeser") {
      Room_Key = Generate_key();
    }

    // Create a new room instance
    const newRoom = new Rooms({
      Room_Name: room_name,
      Room_Admin,
      Room_Members: [],
      Room_Enc_Type,
      Room_Key,
      Room_Password: hashedPass,
      Room_Msgs: [],
    });
    await newRoom.save();

    const token_data = {
      Room_ID: newRoom._id,
      User: newRoom.Room_Admin,
    };

    const token = jwt.sign(token_data, secret_key);

    setTimeout(async () => {
      try {
        await Rooms.findByIdAndDelete(newRoom._id);
        console.log(`Room ${newRoom._id} deleted after 24 hrs.`);
      } catch (error) {
        console.error("Error deleting the room: ", error);
      }
    }, 24 * 60 * 60 * 1000);

    return res.status(201).json({
      Message: "Room created successfully",
      RoomID: newRoom._id,
      Token: token,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res
      .status(500)
      .json({ error: "Failed to create room", error: error.message });
  }
}

async function Get_room(req, res) {
  try {
    const room_id = req.query.room_id;
    const room = await Rooms.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const messageIDs = room.Room_Msgs;
    const messages = [];

    for (const messageID of messageIDs) {
      const message = await Messages.findById(messageID);
      if (message) {
        var decrypted;
        if (room.Room_Enc_Type === "Ascii") {
          decrypted = (await A_Decrypt(message.Encrypted_Content)).replace(
            /\x00/g,
            ""
          );
        }
        if (room.Room_Enc_Type === "Binary") {
          decrypted = await B_Decrypt(message.Encrypted_Content);
        }
        if (room.Room_Enc_Type === "Caeser") {
          const key = room.Room_Key;
          decrypted = await C_Decrypt(key, message.Encrypted_Content);
        }
        messages.push({
          Sender: message.Sender,
          Encrypted_message: message.Encrypted_Content,
          Original_message: decrypted,
        });
      }
    }

    return res.status(200).json({
      Name: room.Room_Name,
      Admin: room.Room_Admin,
      Members: room.Room_Members,
      Messages: messages,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res
      .status(500)
      .json({ error: "Failed to get room", error: error.message });
  }
}

module.exports = { Create_room, Get_room };
