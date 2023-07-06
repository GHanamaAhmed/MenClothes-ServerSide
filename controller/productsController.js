const ProductModel = require("../models/productModel");
const { removeValidate } = require("../utils/validate/genralValidate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  addProductValidate,
  updateProductValidate,
} = require("../utils/validate/productValidate");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      !fs.existsSync(
        path.resolve(__dirname, "../uploads/products/" + req.product._id)
      )
    ) {
      try {
        fs.mkdirSync(
          path.resolve(__dirname, "../uploads/products/" + req.product._id)
        );
      } catch (error) {
        return cb(error);
      }
    }
    cb(null, `uploads/products/` + req.product._id);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now().toString() + "-" + file.originalname;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

//exports functions
module.exports.fetch = async (req, res) => {
  const { max, min } = req.params;
  const products = await ProductModel.find({}).limit(max);
  const products2 = products.slice(min);
  res.status(200).send(products2);
};

module.exports.add = async (req, res, next) => {
  const { error } = addProductValidate.validate(req.body);
  if (error) return res.status(401).send(error);
  const product = ProductModel({
    ...req.body,
  });
  product.photos = [];
  req.product = product;
  next();
};
module.exports.store = async (req, res) => {
  req?.files?.map((e) => {
    req.product.photos.push(
      `${process.env.DOMAIN_NAME}/photos/products/${req.product._id}/${e.filename}`
    );
  });
  await req.product.save();
  res.status(200).send(req.product);
};
module.exports.upload = upload;

module.exports.delete = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(401).send(error);
  const product = await ProductModel.findByIdAndDelete(req.body.id, {
    new: true,
  });
  try {
    fs.rmSync(path.resolve(__dirname, "../uploads/products/" + product._id), {
      recursive: true,
      force: true,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
  res.status(200).send(product);
};

module.exports.update = async (req, res) => {
  const { error } = updateProductValidate.validate(req.body);
  if (error) return res.status(401).send(error);
  const product = await ProductModel.findByIdAndUpdate(
    req.body.id,
    {
      $set: { ...req.body.data },
    },
    { new: true }
  );
  res.status(200).send(product);
};
