const ProductModel = require("../models/productModel");
const path = require("path");
module.exports.fetch = (req, res) => {
  const { folderName, id, fileName } = req.params;
  if (!folderName || !id || !fileName)
    return res.status(400).send("params not enough!");
  res.sendFile(
    path.resolve(
      __dirname,
      `../uploads/${folderName}/${id}/${fileName}`
    )
  );
};
