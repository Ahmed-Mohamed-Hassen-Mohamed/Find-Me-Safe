const Message = require("../models/messages");

// Example controller functions

exports.getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const _messages = await Message.updateMany(
      { chatId },
      { isRead: true }
    );
    const messages = await Message.find({ chatId }).sort({ _id: -1 });
    if (!messages.length) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "Not messages is found" });
    }
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send(err);
  }
};
