const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const contactParticipants = require("../controllers/contactParticipants");

router.post("/contactParticipant", userAuth, contactParticipants.addParticipant);
router.get("/childContactParticipants/:id", userAuth, contactParticipants.getParticipants);
router.get("/emergencyContactParticipants/:id", userAuth, contactParticipants.getParticipantsByContactId);
router.get("/contactParticipants/:id", userAuth, contactParticipants.getParticipantById);
router.patch(
  "/contactParticipants/:id",
  userAuth,
  contactParticipants.updateParticipantById
);
router.delete(
  "/contactParticipants/:id",
  userAuth,
  contactParticipants.deleteParticipantById
);

module.exports = router;
