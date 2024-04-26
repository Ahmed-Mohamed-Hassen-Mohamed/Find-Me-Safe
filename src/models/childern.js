const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
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
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  birthDate: {
    type: Date,
    required: true,
  },
  photo: {
    type: Buffer,
    required: true,
  },
});

childSchema.pre('remove', async function (next) {
  await this.model('MedicalRecord').deleteMany({ childId: this._id });
  await this.model('ContectPrescription').deleteMany({ childId: this._id });
  next();
});

childSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  return userObject;
};

const Child = mongoose.model("Child", childSchema);
module.exports = Child;
