const ProductModel = require("../models/productModel");
const {
  removeValidate,
  rangeValidate,
  fetchOneValidate,
} = require("../utils/validate/genralValidate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const {
  addProductValidate,
  updateProductValidate,
  updateProductValidate2,
} = require("../utils/validate/productValidate");
const sharp = require("sharp");
const {
  moveFileUrl,
  removeFolderUrl,
  removeFolder,
  moveFile,
  removeFile,
  removeFileUrl,
  deleteFolderRecursive,
  baseUrl,
  convertUrlToPath,
} = require("../utils/files/files");
const likeModel = require("../models/likeModel");
const mongoose = require("mongoose");
const basketModel = require("../models/basketModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const commentModel = require("../models/commentModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      !fs.existsSync(
        path.resolve(__dirname, "../uploads/products/" + req.folderName)
      )
    ) {
      try {
        fs.mkdirSync(
          path.resolve(__dirname, "../uploads/products/" + req.folderName)
        );
      } catch (error) {
        return cb(error);
      }
    }
    cb(null, `uploads/products/` + req.folderName);
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
      mimeType == "image/x-png" ||
      mimeType == "image/png" ||
      mimeType == "image/jpeg" ||
      mimeType == "image/gif" ||
      mimeType == "image/webp"
    ) {
      cb(null, true);
    } else {
      cb("the picture must on of bmb ,jpeg ,x-png ,png ,gif");
    }
  },
});

//exports methods
module.exports.initialize = async (req, res, next) => {
  req.folderName = uuid();
  next();
};

module.exports.fetch = async (req, res) => {
  try {
    const { error } = rangeValidate.validate(req.query);
    if (error) return res.status(400).send(error.message);
    const { min, max, type, name, reverse } = req.query;
    const userId = req?.user?._id;
    const products = await ProductModel.aggregate([
      {
        $match: {
          $and: type
            ? [
                { type: { $regex: type ? type : "" } },
                { name: { $regex: name ? name : "" } },
              ]
            : [{ name: { $regex: name ? name : "" } }],
        },
      },
      {
        $lookup: {
          from: "likes",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$productId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "baskets",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$productId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "baskets",
        },
      },
      {
        $addFields: {
          isLike: { $gt: [{ $size: "$likes" }, 0] },
          isSave: { $gt: [{ $size: "$baskets" }, 0] },
        },
      },
      {
        $project: {
          users: 0,
          likes: 0,
        },
      },
      { $sort: { createAt: reverse ? 1 : -1 } },
      { $skip: Number(min) > 0 ? Number(min) : 0 },
      {
        $limit:
          Number(max) > 0
            ? Number(max)
            : Number(min) > 0
            ? Number(min) + 10
            : 10,
      },
    ]);
    const types = await ProductModel.aggregate([
      {
        $match: {
          type: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$type",
        },
      },
    ]);
    res.status(200).json({
      products,
      types: types.map((e) => e?._id),
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.count = async (req, res) => {
  try {
    const count = await ProductModel.count();
    res.status(200).json({ count });
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.fetchOne = async (req, res) => {
  try {
    const { error } = fetchOneValidate.validate(req.params);
    if (error) return res.status(400).send(error.message);
    const { id } = req.params;
    const userId = req?.user?._id;
    const product = await ProductModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "likes",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$postId", "$$productId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "baskets",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$productId", "$$productId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "baskets",
        },
      },
      {
        $addFields: {
          isLike: { $gt: [{ $size: "$likes" }, 0] },
          isSave: { $gt: [{ $size: "$baskets" }, 0] },
        },
      },
      {
        $project: {
          users: 0,
          likes: 0,
        },
      },
    ]);
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.add = async (req, res, next) => {
  try {
    let body = { ...req?.body };
    if (body && body?.details) {
      body.details = JSON.parse(body.details);
    }
    const { error } = addProductValidate.validate(body);
    if (error || !req.files?.thumbanil) {
      let delPath;
      if (req.files?.photos?.length) {
        delPath = baseUrl() + "/" + req.files?.photos[0]?.destination;
      } else if (req.files?.thumbanil?.length) {
        delPath = baseUrl() + "/" + req.files?.thumbanil[0]?.destination;
      }
      removeFolder(delPath);
      return res
        .status(400)
        .send(error?.message || "thumbanil field is require!");
    }
    const details = body?.details; // Temporarily
    delete body?.details;
    const product = ProductModel({
      ...body,
      photos: [],
      path: req.folderName && "uploads/products/" + req.folderName,
    });
    req?.files?.thumbanil?.map(async (e) => {
      const oldPath = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
      const newPath = `${process.env.DOMAIN_NAME}/${product.path}/${
        e.filename.split(".")[0]
      }.webp`;
      product.thumbanil = newPath;
      await sharp(convertUrlToPath(oldPath))
        .webp()
        .toFile(newPath.replace(`${process.env.DOMAIN_NAME}/`, ""));
      removeFileUrl(convertUrlToPath(oldPath));
    });
    details?.map((e, i) => {
      let newPaths = [];
      req?.files?.photos
        ?.slice(
          i ? details[i - 1].nPhotos : 0,
          i ? details[i - 1]?.nPhotos + e.nPhotos : e.nPhotos
        )
        .map(async (e, i) => {
          const oldPath = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
          const newPath = `${process.env.DOMAIN_NAME}/${product.path}/${
            e.filename.split(".")[0]
          }.webp`;
          newPaths.push(newPath);
          await sharp(convertUrlToPath(oldPath))
            .webp()
            .toFile(newPath.replace(`${process.env.DOMAIN_NAME}/`, ""));
          removeFileUrl(convertUrlToPath(oldPath));
        });
      const photo = {
        photos: newPaths,
        sizes: details && details?.length >= i ? details[i]?.sizes : undefined,
        color: details && details?.length >= i ? details[i]?.color : undefined,
        quntity:
          details && details?.length >= i ? details[i]?.quntity : undefined,
      };
      product.photos.push(photo);
    });
    await product.save();
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.upload = upload;

module.exports.delete = async (req, res) => {
  try {
    const { error } = removeValidate.validate(req.body);
    if (error) return res.status(400).send(error.message);
    const product = await ProductModel.findByIdAndDelete(req.body.id, {
      new: true,
    });
    const pathName = path.resolve(__dirname, "../" + product?.path);
    if (fs.existsSync(pathName) && product?.path) {
      try {
        deleteFolderRecursive(pathName);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
    await likeModel.findOneAndDelete({ postId: product._id, type: "product" });
    await commentModel.findOneAndDelete({
      postId: product._id,
      type: "product",
    });
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.update = async (req, res) => {
  try {
    let body = { ...req?.body };
    if (body && body?.details) {
      body.details = JSON.parse(body.details);
    }
    const { error } = updateProductValidate.validate(body);
    if (error || !req.files?.thumbanil) {
      let delPath;
      if (req.files?.photos?.length) {
        delPath = baseUrl() + "/" + req.files?.photos[0]?.destination;
      } else if (req.files?.thumbanil?.length) {
        delPath = baseUrl() + "/" + req.files?.thumbanil[0]?.destination;
      }
      deleteFolderRecursive(delPath);
      return res.status(400).send(error?.message || "يجب اضافة صورة المنتج!");
    }
    const id = body?.id;
    delete body?.id;
    const details = body?.details; // Temporarily
    delete body?.details;
    const prevProduct = await ProductModel.findById(id);
    const pathName = path.resolve(__dirname, "../" + prevProduct?.path);
    if (fs.existsSync(pathName) && prevProduct?.path) {
      try {
        removeFolder(pathName);
      } catch (error) {
        return res.status(500).send(error);
      }
    }
    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...body,
          photos: [],
          path: req.folderName && "uploads/products/" + req.folderName,
        },
      },
      { new: true }
    );
    req?.files?.thumbanil?.map(async (e) => {
      const oldPath = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
      const newPath = `${process.env.DOMAIN_NAME}/${product.path}/${
        e.filename.split(".")[0]
      }.webp`;
      product.thumbanil = newPath;
      await sharp(convertUrlToPath(oldPath))
        .webp()
        .toFile(newPath.replace(`${process.env.DOMAIN_NAME}/`, ""));
      removeFileUrl(convertUrlToPath(oldPath));
    });
    details?.map((e, i) => {
      let newPaths = [];
      req?.files?.photos
        ?.slice(
          i ? details[i - 1].nPhotos : 0,
          i ? details[i - 1]?.nPhotos + e.nPhotos : e.nPhotos
        )
        .map(async (e, i) => {
          const oldPath = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
          const newPath = `${process.env.DOMAIN_NAME}/${product.path}/${
            e.filename.split(".")[0]
          }.webp`;
          newPaths.push(newPath);
          await sharp(convertUrlToPath(oldPath))
            .webp()
            .toFile(newPath.replace(`${process.env.DOMAIN_NAME}/`, ""));
          removeFileUrl(convertUrlToPath(oldPath));
        });
      const photo = {
        photos: newPaths,
        sizes: details && details?.length >= i ? details[i]?.sizes : undefined,
        color: details && details?.length >= i ? details[i]?.color : undefined,
        quntity:
          details && details?.length >= i ? details[i]?.quntity : undefined,
      };
      product.photos.push(photo);
    });
    await product.save();
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.update2 = async (req, res) => {
  try {
    const body = req.body;
    const { error } = updateProductValidate2.validate(body);
    if (error) return res.states(400).send(error.message);
    const id = body?.id;
    delete body?.id;
    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: { ...body },
      },
      { new: true }
    );
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports.statstique = async (req, res) => {
  try {
    const products = await productModel.find({}).count();
    const lastProducts = await productModel
      .find({
        createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
      })
      .count();
    const likes = await likeModel.find({ type: "product" }).count();
    const lastLikes = await likeModel
      .find({
        type: "product",
        createAt: { $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24) },
      })
      .count();
    const sales = await orderModel.find({ states: "completed" }).count();
    const lastSales = await orderModel
      .find({
        createAt: {
          $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
        },
        states: "completed",
      })
      .count();
    const returns = await orderModel.find({ states: "return" }).count();
    const lastReturns = await orderModel
      .find({
        states: "return",
        createAt: {
          $gte: new Date(Date.now() - 30 * 1000 * 60 * 60 * 24),
        },
      })
      .count();
    res.status(200).json({
      products,
      lastProducts,
      likes,
      lastLikes,
      sales,
      lastSales,
      returns,
      lastReturns,
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
