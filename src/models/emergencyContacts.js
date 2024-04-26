const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    minlength: "3",
    trim: true,
  },
  relationship: {
    type: String,
    required: true,
    minlength: "2",
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{11}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

emergencyContactSchema.pre("remove", async function (next) {
  await this.model("ContectPrescription").deleteMany({
    emergencyContactId: this._id,
  });
  next();
});

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);
module.exports = EmergencyContact;
