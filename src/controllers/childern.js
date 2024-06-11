const Child = require("../models/childern");

// Example controller functions

exports.addChild = async (req, res) => {
  try {
    const child = new Child({ ...req.body });
    child.photo = req.file.buffer;
    await child.save();
    res.status(200).send(child);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getChildById = async (req, res) => {
  try {
    const _id = req.params.id;
    const child = await Child.findById(_id);
    if (!child) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This child is not found" });
    }
    res.status(200).send(child);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserChildern = async (req, res) => {
  try {
    const userId = req.params.id;
    const childern = await Child.find({ userId });
    // if (!childern.length) {
    //   return res
    //     .status(404)
    //     .send({ Error: "Not found", message: "Not childern is found" });
    // }
    res.status(200).send(childern);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateChildById = async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const _id = req.params.id;
    const child = await Child.findById(_id);
    if (!child) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This child is not found" });
    }
    updates.forEach((key) => {
      child[key] = req.body[key];
    });
    if (req.file) {
      child.photo = req.file.buffer;
    }
    await child.save();
    res.status(200).send(child);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteChildById = async (req, res) => {
  try {
    const _id = req.params.id;
    const child = await Child.findByIdAndDelete(_id);
    if (!child) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This child is not found" });
    }
    res.status(200).send("Child has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};
