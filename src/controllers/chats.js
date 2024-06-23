const Chat = require("../models/chats");

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
    const chats = await Chat.find({
      $or: [{ parentId: req.user._id }, { finderId: req.user._id }],
    }).sort({ _id: -1 });
    // if (!chats.length) {
    //   return res
    //     .status(404)
    //     .send({ Error: "Not found", message: "Not chats is found" });
    // }
    res.status(200).send(chats);
  } catch (err) {
    res.status(500).send(err);
  }
};
