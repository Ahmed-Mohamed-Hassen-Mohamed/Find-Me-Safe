const express = require("express");
const router = express.Router();
const userAuth = require("../middelware/userAuth");
const medicalPrescriptions = require("../controllers/medicalPrescriptions");

router.post(
  "/medicalPrescription",
  userAuth,
  medicalPrescriptions.addPrescription
);
router.get(
  "/medicalRecordPrescriptions/:id",
  userAuth,
  medicalPrescriptions.getPrescriptions
);
router.get(
  "/medicalPrescriptions/:id",
  userAuth,
  medicalPrescriptions.getPrescriptionById
);
router.patch(
  "/medicalPrescriptions/:id",
  userAuth,
  medicalPrescriptions.updatePrescriptionById
);
router.delete(
  "/medicalPrescriptions/:id",
  userAuth,
  medicalPrescriptions.deletePrescriptionById
);

module.exports = router;
