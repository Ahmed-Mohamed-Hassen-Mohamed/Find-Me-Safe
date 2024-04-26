const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userAuth = require("../middelware/userAuth");
const embedding = require("../controllers/embedding");
const directory = path.join(__dirname, "../assets/img/images");

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory);
}
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory); // Save files to the "src/assets/img/images" directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original file name
    },
  }),
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."));
    }
  },
});

const _upload = multer({
  fileFilter(req, file, cd) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cd(new Error("Please upload image"));
    }
    cd(null, true);
  },
});

router.post("/addImages", userAuth, upload.array("images"), embedding.addEmbedding);
router.post("/predict", userAuth, _upload.array("images"), embedding.predict);
router.get("/retrain", embedding.retrain);
module.exports = router;
