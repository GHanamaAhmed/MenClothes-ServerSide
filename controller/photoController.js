const ProductModel = require("../models/productModel");
const path = require("path");
const fs = require("fs");
const { photoValidate } = require("../utils/validate/genralValidate");
// create url photo
const cupp = (type, folderName, filename) =>
  `${process.env.DOMAIN_NAME}/uploads/${type}/${folderName}/${filename}`;

//export methods
module.exports.fetch = (req, res) => {
  const { error } = photoValidate.validate(req.params);
  if (error) return res.status(400).send(error);
  const { type, folderName, fileName } = req.params;
  res.sendFile(
    path.resolve(__dirname, `../uploads/${type}/${folderName}/${fileName}`)
  );
};
module.exports.delete = async (req, res) => {
  const { error } = photoValidate.validate(req.body);
  if (error) return res.status(400).send(error);
  const { folderName, type, fileName } = req.body;
  if (type == "products") {
    const product = await ProductModel.findOne({
      path: `uploads/${type}/${folderName}`,
    });
    if (product) {
      product.photos = product.photos.filter((e) => {
        console.log(e == cupp(type, folderName, fileName));
        return e != cupp(type, folderName, fileName);
      });
      await product.save();
    }
  }
  const pathName = path.resolve(
    __dirname,
    `../uploads/${type}/${folderName}/${fileName}`
  );
  if (fs.existsSync(pathName)) {
    try {
      fs.unlinkSync(pathName);
      res.status(200).send(pathName);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  res.status(404).send("file dont found!");
};
