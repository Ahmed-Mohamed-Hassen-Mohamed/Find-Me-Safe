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
    const iris = req.files.iris;
    const voices = req.files.voice;

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

    fingerprints.forEach((fingerprint) => {
      formFingerprint.append("images", new Blob([fingerprint.buffer]), {
        filename: fingerprint.originalname,
        contentType: fingerprint.mimetype,
      });
    });

    iris.forEach((iris) => {
      formIris.append("images", new Blob([iris.buffer]), {
        filename: iris.originalname,
        contentType: iris.mimetype,
      });
    });

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
    const fingerprint = req.files.fingerprint[0];
    const iris = req.files.iris[0];
    const voice = req.files.voice[0];

    const formData = new FormData();

    formData.append("face", new Blob([face.buffer]), {
      filename: face.originalname,
      contentType: face.mimetype,
    });
    formData.append("fingerprint", new Blob([fingerprint.buffer]), {
      filename: fingerprint.originalname,
      contentType: fingerprint.mimetype,
    });

    formData.append("iris", new Blob([iris.buffer]), {
      filename: iris.originalname,
      contentType: iris.mimetype,
    });
    formData.append("voice", new Blob([voice.buffer]), {
      filename: voice.originalname,
      contentType: voice.mimetype,
    });

    // const response = await fetch(
    //   "https://87c3-41-46-33-205.ngrok-free.app/predict/",
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    // const data = await response.json();

    const data = {
      id: "666190f5d648b81bcc5ee331",
    };

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
