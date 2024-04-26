const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const addresses = require("../controllers/addresses");

router.post("/address", userAuth, addresses.addAddress);
router.get("/UserAddresses/:id", userAuth, addresses.getUserAddresses);
router.get("/addresses/:id", userAuth, addresses.getAddressById);
router.patch("/addresses/:id", userAuth, addresses.updateAddressById);
router.delete("/addresses/:id", userAuth, addresses.deleteAddressById);

module.exports = router;
