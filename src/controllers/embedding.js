const Embedding = require("../models/embedding");
const Childern = require("../models/childern");
const Participant = require("../models/contactParticipants");
const MedicalRecord = require("../models/medicalRecords");
const { createChat } = require("../controllers/chats");
const { sendNotification } = require("../socket");
let IO;

exports.sharedSocket = (io) => {
  IO = io;
};

exports.addEmbedding = async (req, res) => {
  try {
    const faces = req.files.face;
    const fingerprints = req.files.fingerprint;

    const formFace = new FormData();
    const formFingerprint = new FormData();

    faces.forEach((face) => {
      formFace.append("images", new Blob([face.buffer]), face.originalname);
    });

    fingerprints.forEach((fingerprint) => {
      formFingerprint.append(
        "images",
        new Blob([fingerprint.buffer]),
        fingerprint.originalname
      );
    });

    const [responseFace, responseFingerprint] = await Promise.all([
      fetch("http://127.0.0.1:8000/get_embedding_face/", {
        method: "POST",
        body: formFace,
      }),
      fetch("http://127.0.0.1:8000/get_embedding_fingerprint/", {
        method: "POST",
        body: formFingerprint,
      }),
    ]);

    if (!responseFace.ok || !responseFingerprint.ok) {
      throw new Error("Error in fetching embeddings");
    }
    const face = await responseFace.json();
    const fingerprint = await responseFingerprint.json();

    for (let fa of face.embedding) {
      for (let fi of fingerprint.embedding) {
        const embedding = new Embedding({
          embedding: [fa, fi],
          childId: req.body.childId,
        });
        await embedding.save();
      }
    }
    res.status(200).send("ok");
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send(err.message || "Bad Request");
  }
};

exports.predict = async (req, res) => {
  try {
    const face = req.files[0];
    const fingerprint = req.files[1];

    const formData = new FormData();

    formData.append("face", new Blob([face.buffer]), {
      filename: face.originalname,
      contentType: face.mimetype,
    });

    formData.append("fingerprint", new Blob([fingerprint.buffer]), {
      filename: fingerprint.originalname,
      contentType: fingerprint.mimetype,
    });

    const response = await fetch("http://127.0.0.1:8000/predict/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const child = await Childern.findOne({ _id: data.id }).populate("userId");
    if (!child) {
      return res.status(404).send("Child not found");
    }
    const participants = await Participant.find({
      childId: child._id,
    }).populate("emergencyContactId");
    let medicalRecords = await MedicalRecord.find({
      childId: child._id,
    });

    const chatData = {
      childId: child._id,
      parentId: child.userId._id,
      finderId: req.user._id,
    };
    await createChat(chatData);

    const notificationData = {
      userId: child.userId._id,
      content: "Hello World",
      status: "True",
      type: "Find Child",
    };
    await sendNotification(notificationData, IO);

    res.status(200).send({ child, participants, medicalRecords });
  } catch (err) {
    res.status(400).send(err.message || "Bad Request");
  }
};

exports.retrain = async (req, res) => {
  try {
    const embeddings = await Embedding.find({});
    const items = embeddings.map((item) => {
      return { id: String(item._id), embedding: item.embedding };
    });
    const response = await fetch("http://127.0.0.1:8000/retrain/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).send(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send(err.message || "Bad Request");
  }
};
