const Embedding = require("../models/embedding");

exports.addEmbedding = async (req, res) => {
  try {
    const images = req.files;
    const paths = images.map((image) => image.path);
    const responseFingerprint = await fetch(
      "http://127.0.0.1:8000/get_embedding_fingerprint/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paths),
      }
    );
    if (!responseFingerprint.ok) {
      throw new Error(`HTTP error! Status: ${responseFingerprint.status}`);
    }

    const responseFace = await fetch(
      "http://127.0.0.1:8000/get_embedding_face/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paths),
      }
    );
    if (!responseFace.ok) {
      throw new Error(`HTTP error! Status: ${responseFace.status}`);
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
      contentType: face.mimetype
    });
    
    formData.append("fingerprint", new Blob([fingerprint.buffer]), {
      filename: fingerprint.originalname,
      contentType: fingerprint.mimetype
    });

    const response = await fetch("http://127.0.0.1:8000/predict/", {
      method: "POST",
      body: formData,
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
