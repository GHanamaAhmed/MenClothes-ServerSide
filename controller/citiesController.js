const wilaya = require("../data/wilaya.json");
const baladya = require("../data/baladya.json");
module.exports.fetchWilaya = async (req, res) => {
  res.status(200).json(wilaya);
};
module.exports.fetchBaladya = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ادخل الولاية اولا");
  res.status(200).send(baladya.filter((e) => e.wilaya_id == id));
};
