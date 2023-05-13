const express = require("express");
const { Image } = require("../../db/models");
const {
 multipleFilesUpload,
 multipleMulterUpload,
 retrievePrivateFile,
} = require("../../awsS3");
const router = express.Router();

router.post("/:userId", multipleMulterUpload("images"), async (req, res) => {
 const { userId } = req.params;
 console.log("    userId", userId);
 const keys = await multipleFilesUpload({ files: req.files });
 console.log("    keys", keys);
 const images = await Promise.all(
  keys.map((key) => Image.create({ key, userId }))
 );
 console.log("    images", images);
 const imageUrls = images.map((image) => retrievePrivateFile(image.key));
 return res.json(imageUrls);
});

router.get("/:userId", async (req, res) => {
 const images = await Image.findAll({
  where: { userId: req.params["userId"] },
 });
 const imageUrls = images.map((image) => retrievePrivateFile(image.key));
 return res.json(imageUrls);
});

module.exports = router;
