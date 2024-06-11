const Contact = require("../models/emergencyContacts");

// Example controller functions

exports.addContact = async (req, res) => {
  try {
    const contact = new Contact({ ...req.body });
    await contact.save();
    res.status(200).send(contact);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getContactById = async (req, res) => {
  try {
    const _id = req.params.id;
    const contact = await Contact.findById(_id);
    if (!contact) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This contact is not found" });
    }
    res.status(200).send(contact);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserContacts = async (req, res) => {
  try {
    const userId = req.params.id;
    const contacts = await Contact.find({ userId });
    // if (!contacts.length) {
    //   return res
    //     .status(404)
    //     .send({ Error: "Not found", message: "Not contacts is found" });
    // }
    res.status(200).send(contacts);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateContactById = async (req, res) => {
  try {
    const _id = req.params.id;
    const contact = await Contact.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!contact) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This contact is not found" });
    }
    res.status(200).send(contact);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteContactById = async (req, res) => {
  try {
    const _id = req.params.id;
    const contact = await Contact.findByIdAndDelete(_id);
    if (!contact) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This contact is not found" });
    }
    res.status(200).send("Contact has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};
