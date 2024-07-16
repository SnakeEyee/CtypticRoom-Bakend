const mongoose = require("mongoose");

const MsgsSchema = new mongoose.Schema({
  Room_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Rooms" },
  Sender: { type: String, required: true },
  Encrypted_Content: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
});

MsgsSchema.pre("remove", async function (next) {
  try {
    const room = await mongoose.model("Rooms").findById(this.Room_ID);
    if (!room) {
      return next(new Error("Room not found"));
    }
    room.Room_Msgs.pull(this._id);
    await room.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports =
  mongoose.models.Messages || mongoose.model("Messages", MsgsSchema);
