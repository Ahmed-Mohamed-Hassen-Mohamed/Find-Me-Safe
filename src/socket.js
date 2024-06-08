const Notification = require("./models/notifications");
const Socket = require("./models/sockets");
const Chat = require("./models/chats");
const Message = require("./models/messages");
const jwt = require("jsonwebtoken");

module.exports = function socketEvents(io) {
  io.on("connection", async (socket) => {
    const token = socket.handshake.query.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, "nodeAPI");
        if (decoded) {
          socket.userId = decoded._id;
          const session = new Socket({
            userId: decoded._id,
            socketId: socket.id,
          });
          await session.save();
          console.log("A user connected");
        }
      } catch (err) {
        console.error("Token verification failed:", err.message);
      }
    } else {
      console.error("Token is missing");
      socket.disconnect(true);
    }

    socket.on("authenticated", (data) => authenticated(data, socket));

    // Listen for notification events
    socket.on("notification", (data) => handleNotification(data, io));

    // Listen for chat events
    socket.on("chat", (data) => handleChat(data, io));

    // Listen for message events
    socket.on("message", (data) => handleMessage(data, io));

    socket.on("disconnect", () => removeSocket(socket));
  });
};

async function removeSocket(socket) {
  try {
    const userId = socket.userId;
    await Socket.findOneAndDelete({ userId });
    console.log("User disconnected");
  } catch (err) {
    console.error(err.message);
  }
}

async function authenticated(data, socket) {
  try {
    const session = new Socket({
      userId: data.userId,
      socketId: socket.id,
    });
    await session.save();
    socket.userId = userId;
  } catch (err) {
    console.error(err.message);
  }
}

async function handleNotification(data, io) {
  try {
    const notification = new Notification(data);
    await notification.save();

    const recipientSocket = await Socket.findOne({ userId: data.userId });
    if (recipientSocket) {
      // console.log("Notification received:", data);
      io.to(recipientSocket.socketId).emit("notification", notification);
    }
  } catch (error) {
    console.error("Error handling notification event:", error);
  }
}

async function handleChat(chatData, io) {
  try {
    const chat = new Chat(chatData);
    await chat.save();

    const recipientSocket = await Socket.findOne({ userId: data.parentId });
    if (recipientSocket) {
      // console.log("Chat received:", chatData);
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
      // console.log("Message received:", messageData);
      io.to(recipientSocket.socketId).emit("message", message);
    }
  } catch (error) {
    console.error("Error handling message event:", error);
  }
}
