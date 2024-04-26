const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const emergencyContacts = require("../controllers/emergencyContacts");

router.post("/emergencyContact", userAuth, emergencyContacts.addContact);
router.get(
  "/userEmergencyContacts/:id",
  userAuth,
  emergencyContacts.getUserContacts
);
router.get(
  "/emergencyContacts/:id",
  userAuth,
  emergencyContacts.getContactById
);
router.patch(
  "/emergencyContacts/:id",
  userAuth,
  emergencyContacts.updateContactById
);
router.delete(
  "/emergencyContacts/:id",
  userAuth,
  emergencyContacts.deleteContactById
);

module.exports = router;
