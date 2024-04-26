const User = require("../models/users");

// Example controller functions

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).send({ message: "Successful" });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const user = req.user
    user.profile = req.file.buffer;
    await user.save();
    res.status(200).send({ user });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "Not users is found" });
    }
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getProfile = async (req, res) => {
  res.status(200).send(req.user);
};

exports.getUserById = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This user is not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This user is not found" });
    }
    updates.forEach((key) => {
      user[key] = req.body[key];
    });
    if (req.file) {
      user.profile = req.file.buffer;
    }
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = req.user;
    const _user = user.deleteOne();
    // if (!_user) {
    //   return res
    //     .status(404)
    //     .send({ Error: "Not found", message: "This user is not found" });
    // }
    res.status(200).send("User has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};
