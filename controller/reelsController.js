const ReelModel = require("../models/reelModel");
const {
  removeValidate,
  fetchOneValidate,
  rangeValidate,
  fetchOneValidateOP,
} = require("../utils/validate/genralValidate");
const multer = require("multer");
const ffmpeg = require("../utils/ffmpeg/ffmpeg");
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
  removeFolderUrl,
} = require("../utils/files/files");
const {
  addReelValidate,
  updateReelValidate,
} = require("../utils/validate/reelValidate");
const likeModel = require("../models/likeModel");
const { default: mongoose } = require("mongoose");
const commentModel = require("../models/commentModel");
const reelModel = require("../models/reelModel");
const Ffmpeg = require("../utils/ffmpeg/ffmpeg");

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

module.exports.fetchOne = async (req, res) => {
  try {
    const { error } = fetchOneValidate.validate(req.params);
    if (error) return res.status(400).send(error.message);
    const { id } = req.params;
    const reels = await ReelModel.findById(id);
    return res.status(200).send(reels);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.fetchAll = async (req, res) => {
  try {
    const { error } = rangeValidate.validate(req.query);
    if (error) return res.status(400).send(error.message);
    const validate = fetchOneValidateOP.validate(req.params);
    if (validate.error) return res.status(400).send(validate.error.message);
    const { max, min, reverse } = req.query;
    const { id } = req.params;
    const userId = req?.user?._id;
    const reels = await ReelModel.aggregate([
      {
        $project: {
          viewsUsersIds: 0,
        },
      },
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
      { $sort: { createAt: reverse ? 1 : -1 } },
      { $skip: Number(min) > 0 ? Number(min) : 0 },
      {
        $limit:
          Number(max) > 0 ? Number(max) : Number(min) > 0 ? Number(min) + 3 : 3,
      },
    ]);
    const firstReel = await ReelModel.aggregate([
      {
        $project: {
          viewsUsersIds: 0,
        },
      },
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
    firstReel?.length > 0 && reels.unshift(...firstReel);
    return res.status(200).send(reels);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.fetchAllAdmin = async (req, res) => {
  const { error } = rangeValidate.validate(req.query);
  if (error) return res.status(400).send(error.message);
  const validate = fetchOneValidateOP.validate(req.params);
  if (validate.error) return res.status(400).send(validate.error.message);
  const { max, min, reverse } = req.query;
  const { id } = req.params;
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
        views: {
          $size: { $ifNull: ["$viewsUsersIds", []] },
        },
      },
    },
    {
      $project: {
        viewsUsersIds: 0,
      },
    },
    { $sort: { createAt: reverse ? 1 : -1 } },
    { $skip: Number(min) > 0 ? Number(min) : 0 },
    {
      $limit:
        Number(max) > 0 ? Number(max) : Number(min) > 0 ? Number(min) + 3 : 3,
    },
  ]);
  const firstReel = await ReelModel.aggregate([
    {
      $project: {
        viewsUsersIds: 0,
      },
    },
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
        views: {
          $size: { $ifNull: ["$viewsUsersIds", []] },
        },
      },
    },
    {
      $project: {
        viewsUsersIds: 0,
      },
    },
  ]);
  firstReel?.length > 0 && reels.unshift(...firstReel);
  return res.status(200).send(reels);
};
module.exports.add = async (req, res, next) => {
  try {
    const { error } = addReelValidate.validate(req.body);
    if (error || !req.file) {
      if (req.file) {
        const delPath =
          baseUrl() + `/${req.file?.destination}/${req.file?.filename}`;
        removeFolder(delPath);
      }
      return res.status(400).send(error.message || "video is require!");
    }
    const reel = new ReelModel({
      ...req.body,
    });
    if (req.file) {
      const Path = `${process.env.DOMAIN_NAME}/${req.file.destination}/${
        req.file.filename.split(".")[0]
      }-852×480.mp4`;
      const prevPath = `${process.env.DOMAIN_NAME}/${req.file.destination}/${req.file.filename}`;
      reel.video = Path;
      const thumbanilName = `thumbanil+${uuid()}.webp`;
      const thumbanilUrl = `${process.env.DOMAIN_NAME}/${req.file.destination}/thumbanils/${thumbanilName}`;
      ffmpeg(convertUrlToPath(prevPath))
        .thumbnail({
          timestamps: ["50%"],
          folder: "uploads/reels/thumbanils",
          filename: thumbanilName,
          size: "480x640",
        })
        .toFormat("webp")
        .on("end", async () => {
          reel.thumbanil = thumbanilUrl;
          Ffmpeg(convertUrlToPath(prevPath))
            .videoCodec("libx264")
            .size("640x?")
            .aspect("9:19")
            .on("end", async function () {
              removeFolder(convertUrlToPath(prevPath));
              setTimeout(() => {
                removeFile(convertUrlToPath(prevPath));
              }, 5000);
              await reel.save();
              return res.status(200).send(reel);
            })
            .save(convertUrlToPath(Path));
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports.upload = upload;

module.exports.delete = async (req, res) => {
  try {
    const { error } = removeValidate.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const reel = await ReelModel.findByIdAndDelete(req.body.id, {
      new: true,
    });
    if (!reel) return res.status(404).send("reel dont exist!");
    removeFolderUrl(reel?.video);
    removeFolderUrl(reel?.thumbanil);
    await likeModel.deleteMany({ postId: reel?._id, type: "reel" });
    await commentModel.deleteMany({ postId: reel?._id, type: "reel" });
    return res.status(200).send(reel);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const body = req.body;
    const { error } = updateReelValidate.validate(body);
    if (error) {
      if (req.file) {
        const delPath = baseUrl() + "/" + req.file?.destination;
        removeFolder(delPath);
      }
      return res.status(400).send(error.message);
    }
    const id = body?.id;
    delete body?.id;
    let reel = await ReelModel.findByIdAndUpdate(
      id,
      {
        $set: { ...body },
      },
      { new: true }
    );
    if (!body?.productId && reel) {
      reel = await ReelModel.findByIdAndUpdate(
        id,
        {
          $unset: { productId: 1 },
        },
        { new: true }
      );
    }
    if (!reel) return res.status(404).send("reel dont exist!");
    if (req?.file) {
      reel?.video && removeFileUrl(reel.video);
      reel.video = `${process.env.DOMAIN_NAME}/${req?.file?.destination}/${req?.file?.filename}`;
    }
    await reel.save();
    return res.status(200).send(reel);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.statistique = async (req, res) => {
  try {
    const reels = await ReelModel.find({}).count();
    const lastReels = await ReelModel.find({
      createAt: { $gt: new Date(new Date() - 1000 * 60 * 60 * 24 * 30) },
    }).count();
    const likes = await likeModel.find({ type: "reel" }).count();
    const lastLikes = await likeModel
      .find({
        type: "reel",
        createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
      })
      .count();
    const comment = await commentModel.find({ type: "reel" }).count();
    const lastComment = await commentModel
      .find({
        type: "reel",
        createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
      })
      .count();
    const views = await ReelModel.aggregate([
      {
        $project: {
          viewsUsersIds: 1,
        },
      },
      { $addFields: { views: { $size: "$viewsUsersIds" } } },
      {
        $group: {
          _id: null,
          views: { $sum: "$views" },
        },
      },
    ]).then((data) => data.length && (data[0]?.views || 0));
    const lastViews = await ReelModel.aggregate([
      { $project: { viewsUsersIds: 1 } },
      { $unwind: "$viewsUsersIds" },
      {
        $match: {
          "viewsUsersIds.createAt": {
            $gt: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
          },
        },
      },
      {
        $count: "views",
      },
    ]).then((data) => data.length && (data[0]?.views || 0));
    res.status(200).json({
      reels,
      lastReels,
      views,
      lastViews,
      likes,
      lastLikes,
      comment,
      lastComment,
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.addView = async (req, res) => {
  try {
    const { userId, reelId } = req.body;
    const reel = await reelModel.findById(reelId);
    reel.viewsUsersIds.push({ userId: userId || "anonyme" });
    await reel.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
};
