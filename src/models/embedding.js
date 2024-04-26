const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Child",
  },
  embedding: {
    type: [[Number]],
    required: true
  }
});

embeddingSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  return userObject;
};

const Embedding = mongoose.model("Embedding", embeddingSchema);
module.exports = Embedding;
