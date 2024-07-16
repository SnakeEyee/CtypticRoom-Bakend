const socketIo = require("socket.io");
const { Validate_token } = require("../Functions/decode_token_middleware.js");
const Rooms = require("../Models/Rooms");
const Messages = require("../Models/Messages.js");
const { A_Encrypt } = require("../Services/Ascii");
const { B_Encrypt } = require("../Services/Binary");
const { C_Encrypt } = require("../Services/Caeser");

function Socket_IO(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", async function connection(socket) {
    const token = socket.handshake.headers.authorization;
    const validation = await Validate_token(token);
    if (!validation.isValid) {
      console.log("Invalid token, disconnecting socket...");
      return socket.disconnect(true);
    }
    socket.room = validation.Room_ID;
    socket.user = validation.Sender;
    socket.join(socket.room);
    console.log("User connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
    // socket.on("chat message sent", async function send(message) {
    //   console.log("message is: %s" + message);
    //   var json = JSON.parse(message);
    //   // console.log("JSON message:",json);
    //   const active_room = await Rooms.findById(socket.room);
    //   var encrypted;
    //   if (active_room.Room_Enc_Type === "Ascii") {
    //     encrypted = await A_Encrypt(json.Message);
    //   }
    //   if (active_room.Room_Enc_Type === "Binary") {
    //     encrypted = await B_Encrypt(json.Message);
    //   }
    //   if (active_room.Room_Enc_Type === "Caeser") {
    //     const key = active_room.Room_Key;
    //     encrypted = await C_Encrypt(key, json.Message);
    //   }
    //   const newMessage = new Messages({
    //     Room_ID: socket.room,
    //     Sender: socket.user,
    //     Encrypted_Content: encrypted,
    //   });
    //   active_room.Room_Msgs.push(newMessage._id);
    //   await active_room.save();
    //   await newMessage.save();
    //   const final_result = {
    //     Sender: socket.user,
    //     Message: encrypted,
    //     Original_message: json.Message,
    //   };
    //   io.to(socket.room).emit(
    //     "chat message received",
    //     JSON.stringify(final_result)
    //   );
    // });
  });
  return io;
}

module.exports = { Socket_IO };
