const ReelModel = require("../models/reelModel");
const { removeValidate } = require("../utils/validate/genralValidate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const {
  addProductValidate,
  updateProductValidate,
} = require("../utils/validate/productValidate");
const {
  removeFolder,
  moveFile,
  removeFileUrl,
  baseUrl,
  convertUrlToPath,
  removeFile,
} = require("../utils/files/files");
const {
  addReelValidate,
  updateReelValidate,
} = require("../utils/validate/reelValidate");
const likeModel = require("../models/likeModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/reels`);
  },
  filename: (req, file, cb) => {
    const fileName = uuid() + "-" + file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const mimeType = file.mimetype;
    if (
      // mimeType == "video/x-flv" ||
      mimeType == "video/mp4"
      // mimeType == "application/x-mpegURL" ||
      // mimeType == "video/MP2T" ||
      // mimeType == "video/3gpp" ||
      // mimeType == "video/quicktime" ||
      // mimeType == "video/x-msvideo" ||
      // mimeType == "video/x-ms-wmv"
    ) {
      cb(null, true);
    } else {
      cb(
        "the video must on of bmb ,c-flv ,mp4 ,x-mpegURL ,MP2T ,3gpp ,quicktime ,x-msvideo ,x-ms-wmv"
      );
    }
  },
});

module.exports.fetch = async (req, res) => {
  const { max, min } = req.params;
  const reels = await ReelModel.find({}).limit(max);
  const reels2 = reels.slice(min);
  return res.status(200).send(reels2);
};

module.exports.add = async (req, res, next) => {
  const { error } = addReelValidate.validate(req.body);
  if (error || !req.file) {
    if (req.file) {
      const delPath =
        baseUrl() + `/${req.file?.destination}/${req.file?.filename}`;
      removeFolder(delPath);
    }
    return res.status(400).send(error || "video is require!");
  }
  const reel =new ReelModel({
    ...req.body,
  });
  if (req.file) {
    const Path = `${process.env.DOMAIN_NAME}/${req.file.destination}/${req.file.filename}`;
    reel.video = Path;
  }
  await reel.save();
  return res.status(200).send(reel);
};

module.exports.upload = upload;

module.exports.delete = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const reel = await ReelModel.findByIdAndDelete(req.body.id, {
    new: true,
  });
  if (!reel) return res.status(404).send("reel dont exist!");
  removeFileUrl(reel?.video);
  await likeModel.findOneAndDelete({ postId: reel?._id, type: "reel" });
  return res.status(200).send(reel);
};

module.exports.update = async (req, res, next) => {
  const body = req.body;
  const { error } = updateReelValidate.validate(body);
  if (error) {
    if (req.file) {
      const delPath = baseUrl() + "/" + req.file?.destination;
      removeFolder(delPath);
    }
    return res.status(400).send(error);
  }
  const id = body?.id;
  delete body?.id;
  const reel = await ReelModel.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );
  if (!reel) return res.status(404).send("reel dont exist!");
  if (req?.file) {
    reel?.video && removeFileUrl(reel.video);
    reel.video = `${process.env.DOMAIN_NAME}/${req?.file?.destination}/${req?.file?.filename}`;
  }
  await reel.save();
  return res.status(200).send(reel);
};
