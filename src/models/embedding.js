const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Child",
  },
  embedding: {
    type: [Number],
    required: true,
  },
  biometricType: {
    type: String,
    enum: ["face", "fingerprint", "iris", "voice"],
    required: true,
  },
});

const Embedding = mongoose.model("Embedding", embeddingSchema);
module.exports = Embedding;
