const Notification = require("../models/notifications");

// Example controller functions

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await Notification.find({ userId }).sort({ _id: -1 });
    if (!notifications.length) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "Not notifications is found" });
    }
    res.status(200).send(notifications);
  } catch (err) {
    res.status(500).send(err);
  }
};
