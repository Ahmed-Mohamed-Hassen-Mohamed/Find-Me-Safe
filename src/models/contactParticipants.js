const mongoose = require("mongoose");

const contectPrescriptionSchema = new mongoose.Schema({
  emergencyContactId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "EmergencyContact",
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Child",
  },
});

const ContectPrescription = mongoose.model(
  "ContectPrescription",
  contectPrescriptionSchema
);
module.exports = ContectPrescription;
