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
  if (fileName) {
    res.sendFile(
      path.resolve(__dirname, `../uploads/${type}/${folderName}/${fileName}`)
    );
  } else {
    const pathFile = path.resolve(
      __dirname,
      `../uploads/${type}/${folderName}`
    );
    const fileState = fs.statSync(pathFile);
    const fileSize = fileState.size;
    let range = req.headers.range;
    if (!range) {
      return res.status(400).send("Requires Range header");
    }
    const chunk = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    console.log(start);
    const end = Math.min(start + chunk, fileSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const stream = fs.createReadStream(pathFile, { start, end });
    stream.pipe(res);
  }
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
