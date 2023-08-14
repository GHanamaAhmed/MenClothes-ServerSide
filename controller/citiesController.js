const wilaya = require("../data/wilaya.json");
const baladya = require("../data/baladya.json");
const deliveyPrice = require("../data/deliveryPrice.json");

module.exports.fetchWilaya = async (req, res) => {
  res.status(200).json(wilaya);
};
module.exports.fetchBaladya = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("ادخل الولاية اولا");
  res.status(200).send(baladya.filter((e) => e.wilaya_id == id));
};
module.exports.delivetyPrice = async (req, res) => {
  try {
    const { id, wilaya1, delivery } = req.query;
    if (!id || !wilaya1 || !delivery)
      return res.status(400).send("ادخل الولاية اولا");
    if (Number(id) <= 48) {
      if (delivery == "homeDelivery") {
        return res
          .status(200)
          .send(deliveyPrice?.[Number(id)].tarif_domicile.toString());
      } else {
        return res
          .status(200)
          .send(deliveyPrice?.[Number(id)].tarif_point_relais.toString());
      }
    } else {
      const index = baladya.findIndex((e) => e.name == wilaya1);
      const wilayaId = baladya?.[index].wilaya_id;
      if (delivery == "homeDelivery") {
        return res
          .status(200)
          .send(deliveyPrice?.[Number(wilayaId)]?.tarif_domicile.toString());
      } else {
        return res
          .status(200)
          .send(
            deliveyPrice?.[Number(wilayaId)]?.tarif_point_relais.toString()
          );
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
