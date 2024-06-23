const Chat = require("../models/chats");
const Message = require("../models/messages");

// Example controller functions

exports.createChat = async (chatData) => {
  try {
    const _chat = await Chat.findOne({
      childId: chatData.childId,
      finderId: chatData.finderId,
    });
    if (!_chat) {
      const chat = new Chat(chatData);
      await chat.save();
    }
  } catch (err) {
    throw new Error({ message: err });
  }
};

exports.getChats = async (req, res) => {
  try {
    const userId = req.params.id;
    let chats = [];

    let _chats = await Chat.find({
      $or: [{ parentId: req.user._id }, { finderId: req.user._id }],
    })
      .populate("parentId finderId")
      .sort({ _id: -1 });

    for (let chat of _chats) {
      let messagesNumber = await Message.countDocuments({
        chatId: chat._id,
        receiverId: req.user._id,
        isRead: false,
      });

      chats.push({
        _id: chat._id,
        childId: chat.childId,
        parentId: chat.parentId,
        finderId: chat.finderId,
        messagesNumber: messagesNumber,
      });
    }

    res.status(200).send(chats);
  } catch (err) {
    res.status(500).send(err);
  }
};

