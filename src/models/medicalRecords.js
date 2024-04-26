const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Child",
  },
  doctorName: {
    type: String,
    required: true,
    minlength: "3",
    trim: true,
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true,
  },
  allergenName: {
    type: String,
    required: true,
    trim: true,
  },
});

medicalRecordSchema.pre('remove', async function (next) {
  await this.model('MedicalPrescription').deleteMany({ medicalRecordId: this._id });
  next();
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
module.exports = MedicalRecord;
