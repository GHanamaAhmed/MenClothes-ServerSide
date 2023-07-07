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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = uuid();
    if (
      !fs.existsSync(
        path.resolve(__dirname, "../uploads/products/" + folderName)
      )
    ) {
      try {
        fs.mkdirSync(
          path.resolve(__dirname, "../uploads/products/" + folderName)
        );
      } catch (error) {
        return cb(error);
      }
    }
    cb(null, `uploads/products/` + folderName);
  },
  filename: (req, file, cb) => {
    const fileName = uuid() + "-" + file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

//exports methods
module.exports.initialize = async (req, res, next) => {
  req.folderName = uuid();
  next();
};

module.exports.fetch = async (req, res) => {
  const { max, min } = req.params;
  const products = await ProductModel.find({}).limit(max);
  const products2 = products.slice(min);
  res.status(200).send(products2);
};

module.exports.add = async (req, res, next) => {
  const { error } = addProductValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const product = ProductModel({
    ...req.body,
    photos: [],
    path: req?.files && req.files[0]?.destination,
  });
  req?.files?.map((e) => {
    product.photos.push(
      `${process.env.DOMAIN_NAME}/${e.destination}/${e.filename}`
    );
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
  const pathName = path.resolve(__dirname, "../" + product.path);
  if (fs.existsSync(pathName) && product?.path) {
    try {
      fs.rmSync(path.resolve(__dirname, "../" + product.path), {
        recursive: true,
        force: true,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  res.status(200).send(product);
};

module.exports.update = async (req, res, next) => {
  const body=req.body
  const { error } = updateProductValidate.validate(body);
  if (error) return res.status(400).send(error);
  const id=body.id
  delete body.id
  const prevPhoto = await ProductModel.findById(id).then(
    (res) => res.photos
  );
  const product = await ProductModel.findByIdAndUpdate(
    id,
    {
      $set: { ...body },
    },
    { new: true }
  );
  product.photos = prevPhoto;
  req?.files?.map((e) => {
    product.photos.push(
      `${process.env.DOMAIN_NAME}/${product.path}/${e.filename}`
    );
    let currentPath = path.resolve(
      __dirname,
      `../${e.destination}/${e.filename}`
    );
    let newPath = path.resolve(
      __dirname,
      `../${product.path}/${e.filename}`
    );
    fs.rename(currentPath, newPath, function (err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
  await product.save();
  res.status(200).send(product);
};
