const express = require("express");
const router = express.Router();
const multer = require("multer");
const userAuth = require("../middelware/userAuth");
const childern = require("../controllers/childern");

const upload = multer({
  fileFilter(req, file, cd) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cd(new Error("Please upload image"));
    }
    cd(null, true);
  },
});

router.post("/child", userAuth, upload.single("photo"), childern.addChild);
router.get("/userChildern/:id", userAuth, childern.getUserChildern);
router.get("/childern/:id", userAuth, childern.getChildById);
router.patch(
  "/childern/:id",
  userAuth,
  upload.single("photo"),
  childern.updateChildById
);
router.delete("/childern/:id", userAuth, childern.deleteChildById);

module.exports = router;
