const ProductModel = require("../models/productModel");
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
  moveFileUrl,
  removeFolderUrl,
  removeFolder,
  moveFile,
  removeFile,
  removeFileUrl,
  deleteFolderRecursive,
  baseUrl,
} = require("../utils/files/files");
const likeModel = require("../models/likeModel");
const mongoose = require("mongoose");
const basketModel = require("../models/basketModel");

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
      mimeType == "image/bmp" ||
      mimeType == "image/x-png" ||
      mimeType == "image/png" ||
      mimeType == "image/jpeg" ||
      mimeType == "image/gif"
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
  const { max, min } = req.params;
  const userId = req?.user?._id;
  const products = await ProductModel.aggregate([
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
  const products2 = products.slice(min, max);
  res.status(200).send(products2);
};

module.exports.add = async (req, res, next) => {
  const { error } = addProductValidate.validate(req.body);
  if (error||!req.files?.thumbanil) {
    let delPath;
    if (req.files?.photos?.length) {
      delPath = baseUrl() + "/" + req.files?.photos[0]?.destination;
    } else if (req.files?.thumbanil?.length) {
      delPath = baseUrl() + "/" + req.files?.thumbanil[0]?.destination;
    }
    removeFolder(delPath);
    return res.status(400).send(error||"thumbanil field is require!");
  }
  const product = ProductModel({
    ...req.body,
    photos: [],
    path: req.folderName && "uploads/products/" + req.folderName,
  });
  req?.files?.thumbanil?.map((e) => {
    const Path = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
    product.thumbanil = Path;
  });
  req?.files?.photos?.map((e) => {
    const Path = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
    product.photos.push(Path);
  });
  await product.save();
  res.status(200).send(product);
};

module.exports.upload = upload;

module.exports.delete = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const product = await ProductModel.findByIdAndDelete(req.body.id, {
    new: true,
  });
  const pathName = path.resolve(__dirname, "../" + product?.path);
  if (fs.existsSync(pathName) && product?.path) {
    try {
      removeFolder(pathName);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  await likeModel.findOneAndDelete({postId:product._id,type:"product"})
  await basketModel.findOneAndDelete({productId:product._id})
  res.status(200).send(product);
};

module.exports.update = async (req, res) => {
  const body = req.body;
  const { error } = updateProductValidate.validate(body);
  if (error) {
    let delPath;
    if (req.files?.photos?.length) {
      delPath = baseUrl() + "/" + req.files?.photos[0]?.destination;
    } else if (req.files?.thumbanil?.length) {
      delPath = baseUrl() + "/" + req.files?.thumbanil[0]?.destination;
    }
    removeFolder(delPath);
    return res.status(400).send(error);
  }
  const id = body.id;
  delete body.id;
  const prevPhoto = await ProductModel.findById(id).then((res) => res.photos);
  const product = await ProductModel.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );
  product.photos = prevPhoto;
  req?.files?.thumbanil?.map((e) => {
    product.thumbanil && removeFileUrl(product.thumbanil);
    product.thumbanil = `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`;
    let currentPath = path.resolve(
      __dirname,
      `../${e.destination}/${e.filename}`
    );
    let newPath = path.resolve(__dirname, `../${product.path}/${e.filename}`);
    moveFile(currentPath, newPath);
  });
  req?.files?.photos?.map((e) => {
    product.photos.push(
      `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`
    );
    let currentPath = path.resolve(
      __dirname,
      `../${e.destination}/${e.filename}`
    );
    let newPath = path.resolve(__dirname, `../${product.path}/${e.filename}`);
    moveFile(currentPath, newPath);
  });
  req.folderName &&
    removeFolder(baseUrl() + "/uploads/products/" + req.folderName);
  await product.save();
  res.status(200).send(product);
};
