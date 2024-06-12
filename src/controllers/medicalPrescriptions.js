const Prescription = require("../models/medicalPrescriptions");

// Example controller functions

exports.addPrescription = async (req, res) => {
  try {
    const participant = new Prescription({ ...req.body });
    await participant.save();
    res.status(200).send(participant);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const _id = req.params.id;
    const participant = await Prescription.findById(_id);
    if (!participant) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This participant is not found" });
    }
    res.status(200).send(participant);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const medicalRecordId = req.params.id;
    const participants = await Prescription.find({ medicalRecordId });
    // if (!participants.length) {
    //   return res
    //     .status(404)
    //     .send({ Error: "Not found", message: "Not participants is found" });
    // }
    res.status(200).send(participants);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updatePrescriptionById = async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const _id = req.params.id;
    const participant = await Prescription.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!participant) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This participant is not found" });
    }
    res.status(200).send(participant);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deletePrescriptionById = async (req, res) => {
  try {
    const _id = req.params.id;
    const participant = await Prescription.findByIdAndDelete(_id);
    if (!participant) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This participant is not found" });
    }
    res.status(200).send({ message: "Participant has been deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
};
