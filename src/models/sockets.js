const mongoose = require("mongoose");

const socketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "User",
  },
  socketId: {
    type: String,
    unique: true,
    required: true,
  },
});

const Socket = mongoose.model("Socket", socketSchema);
module.exports = Socket;
