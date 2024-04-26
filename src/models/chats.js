const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Child",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  finderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
