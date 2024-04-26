const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const chats = require("../controllers/chats");

router.get("/chats/:id", userAuth, chats.getChats);

module.exports = router;
