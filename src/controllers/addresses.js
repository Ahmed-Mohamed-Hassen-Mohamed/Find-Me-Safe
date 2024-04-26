const Address = require("../models/addresses");

// Example controller functions

exports.addAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body });
    await address.save();
    res.status(200).send(address);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const _id = req.params.id;
    const address = await Address.findById(_id);
    if (!address) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This address is not found" });
    }
    res.status(200).send(address);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.params.id;
    const addresses = await Address.find({ userId });
    if (!addresses.length) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "Not addresses is found" });
    }
    res.status(200).send(addresses);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateAddressById = async (req, res) => {
  try {
    const _id = req.params.id;
    const address = await Address.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!address) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This address is not found" });
    }
    res.status(200).send(address);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteAddressById = async (req, res) => {
  try {
    const _id = req.params.id;
    const address = await Address.findByIdAndDelete(_id);
    if (!address) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This address is not found" });
    }
    res.status(200).send("Address has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};
