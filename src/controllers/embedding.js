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
    let fingerprints;
    if (req.files.fingerprint) fingerprints = req.files.fingerprint;
    let iris;
    if (req.files.iris) iris = req.files.iris;
    let voices;
    if (req.files.voice) voices = req.files.voice;

    const formFace = new FormData();
    const formFingerprint = new FormData();
    const formIris = new FormData();
    const formVoice = new FormData();

    faces.forEach((face) => {
      formFace.append("images", new Blob([face.buffer]), {
        filename: face.originalname,
        contentType: face.mimetype,
      });
    });
    if (req.files.fingerprint)
      fingerprints.forEach((fingerprint) => {
        formFingerprint.append("images", new Blob([fingerprint.buffer]), {
          filename: fingerprint.originalname,
          contentType: fingerprint.mimetype,
        });
      });
    if (req.files.iris)
      iris.forEach((iris) => {
        formIris.append("images", new Blob([iris.buffer]), {
          filename: iris.originalname,
          contentType: iris.mimetype,
        });
      });
    if (req.files.voice)
      voices.forEach((voice) => {
        formVoice.append("voices", new Blob([voice.buffer]), {
          filename: voice.originalname,
          contentType: voice.mimetype,
        });
      });

    // const [responseFace, responseFingerprint] = await Promise.all([
    //   fetch("http://127.0.0.1:8000/get_embedding_fingerprint/", {
    //     method: "POST",
    //     body: formFace,
    //   }),
    //   fetch("http://127.0.0.1:8000/get_embedding_fingerprint/", {
    //     method: "POST",
    //     body: formFingerprint,
    //   }),
    // ]);

    // if (!responseFace.ok) {
    //   throw new Error("Error in fetching embeddings");
    // }
    // const face = await responseFace.json();
    // const fingerprint = await responseFingerprint.json();

    // if (faces.length) {
    //   const result = face.result;
    //   for (let face of result) {
    //     const embedding = new Embedding({
    //       embedding: face,
    //       childId: req.body.childId,
    //       biometricType: faces[0].fieldname,
    //     });
    //     await embedding.save();
    //   }
    // }
    res.status(200).send({ message: "successful" });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send(err.message || "Bad Request");
  }
};

exports.predict = async (req, res) => {
  try {
    const face = req.files.face[0];
    let fingerprint;
    if (req.files.fingerprint) fingerprint = req.files.fingerprint[0];
    let iris;
    if (req.files.iris) iris = req.files.iris[0];
    let voice;
    if (req.files.voice) voice = req.files.voice[0];
    const formData = new FormData();
    formData.append("face", new Blob([face.buffer]), {
      filename: face.originalname,
      contentType: face.mimetype,
    });
    if (req.files.fingerprint)
      formData.append("finger", new Blob([fingerprint.buffer]), {
        filename: fingerprint.originalname,
        contentType: fingerprint.mimetype,
      });
    if (req.files.iris)
      formData.append("iris", new Blob([iris.buffer]), {
        filename: iris.originalname,
        contentType: iris.mimetype,
      });
    if (req.files.voice)
      formData.append("voice", new Blob([voice.buffer]), {
        filename: voice.originalname,
        contentType: voice.mimetype,
      });
    const response = await fetch(
      "https://e6e9-41-46-61-175.ngrok-free.app/predict/",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      return res.status(200).send({ message: data.error });
    }
    const child = await Childern.findOne({ _id: data.id });
    if (!child) {
      return res.status(200).send({ message: "Child not found" });
    }
    const participants = await Participant.find({
      childId: child._id,
    }).populate("emergencyContactId");

    let medicalRecords = [];
    const _medicalRecords = await MedicalRecord.find({
      childId: child._id,
    });
    for (let medicalRecord of _medicalRecords) {
      await medicalRecord.populate("medicalPrescription");
      medicalRecords.push({
        _id: medicalRecord._id,
        childId: medicalRecord.childId,
        doctorName: medicalRecord.doctorName,
        diagnosis: medicalRecord.diagnosis,
        allergenName: medicalRecord.allergenName,
        medicalPrescription: medicalRecord.medicalPrescription,
      });
    }

    const chatData = {
      childId: child._id,
      parentId: child.userId._id,
      finderId: req.user._id,
    };
    await createChat(chatData);
    const notificationData = {
      userId: child.userId._id,
      content: `${req.user.firstName} ${req.user.lastName} بواسطه (${child.name}) تهانينا لك لقد تم العثور على طفلك`,
      status: "success",
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
