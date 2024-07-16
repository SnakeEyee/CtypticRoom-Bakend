const Messages = require("../Models/Messages");
const Rooms = require("../Models/Rooms");
const { A_Encrypt } = require("../Services/Ascii");
const { B_Encrypt } = require("../Services/Binary");
const { C_Encrypt } = require("../Services/Caeser");

async function Encryption(req, res, io) {
  try {
    const { Room_ID, User } = req.user;
    const room = await Rooms.findById(Room_ID);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!room.Room_Members.includes(User)) {
      return res
        .status(401)
        .json({ message: "You are not a member in this room!" });
    }
    const { Message } = req.body;
    var encrypted;
    if (room.Room_Enc_Type === "Ascii") {
      encrypted = await A_Encrypt(Message);
    }
    if (room.Room_Enc_Type === "Binary") {
      encrypted = await B_Encrypt(Message);
    }
    if (room.Room_Enc_Type === "Caeser") {
      const key = room.Room_Key;
      encrypted = await C_Encrypt(key, Message);
    }
    const newMessage = new Messages({
      Room_ID: Room_ID,
      Sender: User,
      Encrypted_Content: encrypted,
    });
    await newMessage.save();

    room.Room_Msgs.push(newMessage._id);
    await room.save();

    const final_result = {
      Sender: User,
      Message: encrypted,
      Original_message: Message,
    };

    io.to(Room_ID).emit("chat message received", JSON.stringify(final_result));

    setTimeout(async () => {
      try {
        await Messages.findByIdAndDelete(newMessage._id);
        await room.Room_Msgs.pull(newMessage._id);
        await room.save();
        console.log(`Message ${newMessage._id} deleted after 1 min.`);
      } catch (error) {
        console.error("Error deleting the room: ", error);
      }
    }, 24 * 60 * 60 * 1000);
    return res.status(200).json({ message: "Content added and Room updated" });
  } catch (error) {
    console.error("Error encrypting content:", error);
    return res
      .status(500)
      .json({ error: "Failed to encrypt content", details: error.message });
  }
}

module.exports = { Encryption };
