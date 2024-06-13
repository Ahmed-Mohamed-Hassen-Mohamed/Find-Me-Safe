const Notification = require("./models/notifications");
const Socket = require("./models/sockets");
const Chat = require("./models/chats");
const Message = require("./models/messages");
const jwt = require("jsonwebtoken");

exports.socketEvents = (io) => {
  io.on("connection", async (socket) => {

    socket.on("authenticated", (data) => authenticated(data, socket));

    // Listen for notification events
    // socket.on("notification", (data) => sendNotification(data, io));

    // Listen for chat events
    socket.on("chat", (data) => handleChat(data, io));

    // Listen for message events
    socket.on("message", (data) => handleMessage(data, io));

    socket.on("disconnect", () => removeSocket(socket));
  });
};

async function removeSocket(socket) {
  try {
    const socketId = socket.id;
    await Socket.findOneAndDelete({ socketId });
    console.log("User disconnected");
  } catch (err) {
    console.error(err.message);
  }
}

async function authenticated(data, socket) {
  try {
    let session = await Socket.findOne({ userId: data.userId });
    if (!session) {
      session = new Socket({
        userId: data.userId,
        socketId: socket.id,
      });
    }
    session.socketId = socket.id;
    await session.save();
  } catch (err) {
    console.error(err.message);
  }
}

async function handleChat(chatData, io) {
  try {
    const chat = new Chat(chatData);
    await chat.save();

    const recipientSocket = await Socket.findOne({ userId: data.parentId });
    if (recipientSocket) {
      io.to(recipientSocket.socketId).emit("chat", chat);
    }
  } catch (error) {
    console.error("Error handling chat event:", error);
  }
}

async function handleMessage(messageData, io) {
  try {
    const message = new Message(messageData);
    await message.save();

    const recipientSocket = await Socket.findOne({ userId: data.receiverId });
    if (recipientSocket) {
      io.to(recipientSocket.socketId).emit("message", message);
    }
  } catch (error) {
    console.error("Error handling message event:", error);
  }
}

exports.sendNotification = async (data, io) => {
  try {
    const notification = new Notification(data);
    await notification.save();

    const recipientSocket = await Socket.findOne({ userId: data.userId });
    if (recipientSocket) {
      io.to(recipientSocket.socketId).emit("notification", notification);
    }
  } catch (error) {
    console.error("Error handling notification event:", error);
  }
}
