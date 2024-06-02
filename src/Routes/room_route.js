const express = require("express");
const { Create_room, Get_room } = require("../Functions/room.js");
const { Authorize } = require("../Functions/decode_token_middleware.js");
const { Encryption } = require("../Functions/message.js");
const { Join_room } = require("../Functions/join_room.js");
const { Exit_delete_room } = require("../Functions/delete_room.js");

function Room_routes_builder(io) {
  const router = express.Router();

  router.post("/api/create_room", Create_room);
  router.get("/api/room", Get_room);

  router.post("/api/join_room", (req, res) => {
    Join_room(req, res, io);
  });

  router.post("/api/send_message", Authorize, (req, res) => {
    Encryption(req, res, io);
  });

  router.delete("/api/leave_room", Authorize, (req, res) => {
    Exit_delete_room(req, res, io);
  });

  return router;
}

module.exports = Room_routes_builder;
