const fileName = "../data/info.json";
const path = require("path");
const info = require("../data/info.json");
const fs = require("fs");
module.exports.change = (req, res) => {
  info.email = req.body?.email || "";
  info.facebook = req.body?.facebook || "";
  info.instagram = req.body?.instagram || "";
  info.phone = req.body?.phone || "";
  try {
    fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify(info));
    res.status(200).send(info);
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports.getInfo = (req, res) => {
  res.status(200).send(info);
};
