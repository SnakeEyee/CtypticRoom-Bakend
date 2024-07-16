const Rooms = require("../Models/Rooms");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function Join_room(req, res, io) {
  const secret_key = process.env.SECRET_KEY;
  try {
    const { Room_ID, Room_Password, Room_Member } = req.body;
    const room = await Rooms.findById(Room_ID);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const room_pass = room.Room_Password;
    const is_password_match = await bcrypt.compare(Room_Password, room_pass);
    if (!is_password_match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    if (room.Room_Members.includes(Room_Member)) {
      return res.status(401).json({
        message: "Existed member",
        details: "Your nickname is already in use, please choose another one",
      });
    }

    const token_data = {
      Room_ID: Room_ID,
      User: Room_Member,
    };

    const token = jwt.sign(token_data, secret_key);

    await room.Room_Members.push(Room_Member);
    await room.save();
    io.to(Room_ID).emit("user joined", JSON.stringify({ Room_Member }));
    return res
      .status(201)
      .json({ message: "Joined Room", Token: token, RoomID: room._id });
  } catch (error) {
    console.error("Error updating room members:", error);
    return res
      .status(500)
      .json({ error: "Failed to update room members", details: error.message });
  }
}

module.exports = { Join_room };
