const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const medicalRecords = require("../controllers/medicalRecords");

router.post("/medicalRecord", userAuth, medicalRecords.addRecord);
router.get("/childMedicalRecords/:id", userAuth, medicalRecords.getChildRecords);
router.get("/medicalRecords/:id", userAuth, medicalRecords.getRecordById);
router.patch("/medicalRecords/:id", userAuth, medicalRecords.updateRecordById);
router.delete("/medicalRecords/:id", userAuth, medicalRecords.deleteRecordById);

module.exports = router;
