const express = require("express");
const bodyParser = require("body-parser");
const ConnectToDataBase = require("./Configurations/DB_Connection.js");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const { Socket_IO } = require("./Services/WebSocket.js");

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`Server is listening on port ${PORT}`)
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      callback(null, true);
    },
    credentials: true
  })
);

ConnectToDataBase();

// Web_socket(server);
const io = Socket_IO(server);

const room_builder = require("./Routes/room_route.js");

const room = room_builder(io);
app.use(room);
app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
