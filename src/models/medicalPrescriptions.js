const mongoose = require("mongoose");

const medicalPrescriptionSchema = new mongoose.Schema({
  medicalRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MedicalRecord",
  },
  name: {
    type: String,
    required: true,
    minlength: "2",
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
});

const MedicalPrescription = mongoose.model(
  "MedicalPrescription",
  medicalPrescriptionSchema
);
module.exports = MedicalPrescription;
