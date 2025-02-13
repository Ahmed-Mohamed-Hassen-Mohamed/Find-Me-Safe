const User = require("../models/users");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Example controller functions

exports.sendEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter ${otp} in the app to verify your email address.</p>`,
    };

    await transporter.sendMail(mailOptions, async () => {
      try {
        const payload = { otp };
        const OTPToken = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "30s",
        });

        const user = await User.findOneAndUpdate(
          { email: email },
          { OTPToken },
          {
            new: true,
          }
        );
        if (!user) {
          return res.status(400).send({ message: "User not found" });
        }
        res.status(200).send({ message: "OTP sent and token generated" });
      } catch (error) {
        res.status(404).send({ message: error.message });
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const OTPToken = user.OTPToken;
    if (!OTPToken) {
      return res.status(400).send({ message: "OTP token not found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(OTPToken, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).send({ message: "Invalid or expired OTP token" });
    }

    if (decoded.otp !== otp) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    user = await User.findOneAndUpdate(
      { email: email },
      { flag: true },
      {
        new: true,
      }
    );
    const token = user.generateToken();
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter ${otp} in the app to verify your email address.</p>`,
    };

    let _user = await User.findOne({ email });
    if (_user && _user.flag) {
      return res.status(200).send({ message: "There is an account for this email." });
    }

    await transporter.sendMail(mailOptions);

    const payload = { otp };
    const OTPToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "30s",
    });

    if (_user) {
      req.body.OTPToken = OTPToken;
      await User.findOneAndUpdate({ email: email }, req.body, {
        new: true,
      });
    } else {
      const user = new User(req.body);
      user.OTPToken = OTPToken;
      await user.save();
    }

    res.status(200).send({ message: "OTP sent and token generated" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const user = req.user;
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
    if (user.flag === false) {
      return res.status(401).send({ message: "Email not verified" });
    }
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
    if (!_user) {
      return res
        .status(404)
        .send({ Error: "Not found", message: "This user is not found" });
    }
    res.status(200).send({ message: "User has been deleted"});
  } catch (err) {
    res.status(500).send(err);
  }
};
