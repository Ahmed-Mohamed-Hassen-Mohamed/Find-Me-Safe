const Record = require("../models/medicalRecords");

// Example controller functions

exports.addRecord = async (req, res) => {
  try {
    const record = new Record({ ...req.body });
    await record.save();
    res.status(200).send(record);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const _id = req.params.id;
    const record = await Record.findById(_id);
    if (!record) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This record is not found" });
    }
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getChildRecords = async (req, res) => {
  try {
    const childId = req.params.id;
    const records = await Record.find({ childId }).populate("childId");
    // if (!records.length) {
    //   return res
    //     .status(404)
    //     .send({ Error: "Not found", message: "Not records is found" });
    // }
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateRecordById = async (req, res) => {
  try {
    const _id = req.params.id;
    const record = await Record.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!record) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This record is not found" });
    }
    res.status(200).send(record);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteRecordById = async (req, res) => {
  try {
    const _id = req.params.id;
    const record = await Record.findByIdAndDelete(_id);
    if (!record) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This record is not found" });
    }
    res.status(200).send("Record has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};
