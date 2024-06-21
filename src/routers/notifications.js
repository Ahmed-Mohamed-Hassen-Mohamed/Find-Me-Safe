const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const notifications = require("../controllers/notifications");

router.get("/notifications/:id", userAuth, notifications.getNotifications);
router.get("/notificationsNumber/:id", userAuth, notifications.getNotificationsNumber);

module.exports = router;
