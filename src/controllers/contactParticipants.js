const Participant = require("../models/contactParticipants");

// Example controller functions

exports.addParticipant = async (req, res) => {
  try {
    const participant = new Participant({ ...req.body });
    await participant.save();
    res.status(200).send(participant);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getParticipantById = async (req, res) => {
  try {
    const _id = req.params.id;
    const participant = await Participant.findById(_id);
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

exports.getParticipants = async (req, res) => {
  try {
    const childId = req.params.id;
    const participants = await Participant.find({ childId }).populate(
      "emergencyContactId"
    );
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

exports.getParticipantsByContactId = async (req, res) => {
  try {
    const emergencyContactId = req.params.id;
    const participants = await Participant.find({ emergencyContactId }).populate(
      "emergencyContactId"
    );
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

exports.updateParticipantById = async (req, res) => {
  try {
    const _id = req.params.id;
    const participant = await Participant.findByIdAndUpdate(_id, req.body, {
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

exports.deleteParticipantById = async (req, res) => {
  try {
    const _id = req.params.id;
    const participant = await Participant.findByIdAndDelete(_id);
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
