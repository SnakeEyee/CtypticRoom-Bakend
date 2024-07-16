const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  Room_Name: { type: String, required: true },
  Room_Admin: {
    type: String,
    required: true,
  },
  Room_Members: [{ type: String }],
  Room_Enc_Type: {
    type: String,
    enum: ["Ascii", "Binary", "Caeser"],
    required: true,
  },
  Room_Key: {
    type: String,
    required: function () {
      return this.Room_Enc_Type === "Caeser";
    },
  },
  Room_Password: { type: String, required: true },
  Room_Msgs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  CreatedAt: { type: Date, default: Date.now },
});

RoomSchema.pre("validate", function (next) {
  if (this.Room_Admin && !this.Room_Members.includes(this.Room_Admin)) {
    this.Room_Members.push(this.Room_Admin);
  }
  next();
});

RoomSchema.methods.removeMember = function (user) {
  if (this.Room_Members.includes(user) && this.Room_Admin !== user) {
    this.Room_Members = this.Room_Members.filter((member) => member !== user);
    return true;
  }
  return false;
};

module.exports = mongoose.models.Rooms || mongoose.model("Rooms", RoomSchema);
