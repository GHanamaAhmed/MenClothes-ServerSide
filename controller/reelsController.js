const ReelModel = require("../models/reelModel");
const {
  removeValidate,
  fetchOneValidate,
  rangeValidate,
  fetchOneValidateOP,
} = require("../utils/validate/genralValidate");
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
const { default: mongoose } = require("mongoose");

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
  const { error } = rangeValidate.validate(req.query);
  if (error) return res.status(400).send(error.message);
  const { max, min } = req.query;
  const { idReel } = req.params;
  const reels = await ReelModel.find({}).limit(max);
  const reels2 = reels.slice(min);
  return res.status(200).send(reels2);
};

module.exports.fetchAll = async (req, res) => {
  const { error } = rangeValidate.validate(req.query);
  if (error) return res.status(400).send(error.message);
  const validate = fetchOneValidateOP.validate(req.params);
  if (validate.error) return res.status(400).send(validate.error.message);
  const { max, min } = req.query;
  const { id } = req.params;
  console.log(id);
  const userId = req?.user?._id;
  const reels = await ReelModel.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(id) },
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$type", "reel"] },
                ],
              },
            },
          },
        ],
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: { $size: "$likes" },
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$type", "reel"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "isLike",
      },
    },
    {
      $addFields: {
        isLike: { $gt: [{ $size: "$isLike" }, 0] },
      },
    },
    {
      $lookup: {
        from: "baskets",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "isSave",
      },
    },
    {
      $addFields: {
        isSave: { $gt: [{ $size: "$isSave" }, 0] },
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$type", "reel"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $addFields: {
        comments: { $size: "$comments" },
      },
    },
    {
      $lookup: {
        from: "products",
        let: { productId: "$productId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$productId"] }],
              },
            },
          },
        ],
        as: "productId",
      },
    },
    {
      $addFields: {
        price: { $arrayElemAt: ["$productId.price", 0] },
        productId: { $arrayElemAt: ["$productId._id", 0] },
      },
    },
  ]);
  const firstReel = await ReelModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$type", "reel"] },
                ],
              },
            },
          },
        ],
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: { $size: "$likes" },
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$type", "reel"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "isLike",
      },
    },
    {
      $addFields: {
        isLike: { $gt: [{ $size: "$isLike" }, 0] },
      },
    },
    {
      $lookup: {
        from: "baskets",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                ],
              },
            },
          },
        ],
        as: "isSave",
      },
    },
    {
      $addFields: {
        isSave: { $gt: [{ $size: "$isSave" }, 0] },
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { idReel: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$postId", "$$idReel"] },
                  { $eq: ["$type", "reel"] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $addFields: {
        comments: { $size: "$comments" },
      },
    },
    {
      $lookup: {
        from: "products",
        let: { productId: "$productId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$productId"] }],
              },
            },
          },
        ],
        as: "productId",
      },
    },
    {
      $addFields: {
        price: { $arrayElemAt: ["$productId.price", 0] },
        productId: { $arrayElemAt: ["$productId._id", 0] },
      },
    },
  ]);
  const reels2 = reels.slice(min, max);
  firstReel?.length > 0 && reels2.unshift(...firstReel);
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
  const reel = new ReelModel({
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
