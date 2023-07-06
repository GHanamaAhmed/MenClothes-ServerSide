const ProductModel = require("../models/productModel");
const { removeValidate } = require("../utils/validate/genralValidate");
const {
  addProductValidate,
  updateProductValidate,
} = require("../utils/validate/productValidate");

module.exports.fetch = async (req, res) => {
  const { max, min } = req.params;
  const products = await ProductModel.find({}).limit(max);
  const products2 = products.slice(min);
  res.status(200).send(products2);
};

module.exports.add = async (req, res) => {
  const { error } = addProductValidate.validate(req.body);
  if (error) return res.status(401).send(error);
  const product = ProductModel({
    ...req.body,
  });
  await product.save();
  res.status(200).send(product);
};

module.exports.delete = async (req, res) => {
  const { error } = removeValidate.validate(req.body);
  if (error) return res.status(401).send(error);
  const product = await ProductModel.findByIdAndDelete(req.body.id, {
    new: true,
  });
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
