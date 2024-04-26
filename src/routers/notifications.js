const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const notifications = require("../controllers/notifications");

router.get("/notifications/:id", userAuth, notifications.getNotifications);

module.exports = router;
