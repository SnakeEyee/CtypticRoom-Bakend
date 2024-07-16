const Rooms = require("../Models/Rooms");
const Messages = require("../Models/Messages");

async function Exit_delete_room(req, res, io) {
  try {
    const room_id = req.query.room_id;
    const { Room_ID, User } = req.user;
    const room = await Rooms.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!room._id.equals(Room_ID)) {
      return res
        .status(401)
        .json({ message: "Room session not valid", Details: "No Room" });
    }
    if (!room.Room_Members.includes(User)) {
      return res.status(401).json({
        message: "You are not a member in this room!",
        Details: "Not a member",
      });
    }
    if (room.Room_Members.includes(User) && room.Room_Admin !== User) {
      room.Room_Members = room.Room_Members.filter((member) => member !== User);
      await room.save();
      io.emit(
        "user left",
        JSON.stringify({ isAdmin: false, User, RoomID: Room_ID })
      );
      return res
        .status(200)
        .json({ message: "User removed from room", Done: "User" });
    }

    if (room.Room_Members.includes(User) && room.Room_Admin === User) {
      const messageIDs = room.Room_Msgs;
      for (const messageID of messageIDs) {
        await Messages.findByIdAndDelete(messageID);
      }
      await Rooms.findByIdAndDelete(room_id);
      io.emit(
        "user left",
        JSON.stringify({ isAdmin: true, User, RoomID: Room_ID })
      );
      return res
        .status(200)
        .json({ Message: "Room and Messages deleted", Done: "Room" });
    }
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ Message: "Internal server error" });
  }
}

module.exports = { Exit_delete_room };
