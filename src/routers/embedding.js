const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userAuth = require("../middelware/userAuth");
const embedding = require("../controllers/embedding");
const directory = path.join(__dirname, "../assets/img/images");

const upload = multer({
  fileFilter(req, file, cd) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif|bmp|ogg|mp3)$/)) {
      return cd(new Error("Please upload image"));
    }
    cd(null, true);
  },
});

router.post(
  "/addImages",
  userAuth,
  upload.fields([
    { name: "face" },
    { name: "fingerprint" },
    { name: "iris" },
    { name: "voice" },
  ]),
  embedding.addEmbedding
);
router.post(
  "/predict",
  userAuth,
  upload.fields([
    { name: "face", maxCount: 1 },
    { name: "fingerprint", maxCount: 1 },
    { name: "iris", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  embedding.predict
);
router.get("/retrain", embedding.retrain);
module.exports = router;
