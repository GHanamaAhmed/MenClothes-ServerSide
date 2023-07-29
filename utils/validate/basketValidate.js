const joi = require("joi");
const { objectId } = require("./validateObjctId");
const handleBasketValidate = joi.object({
  id: objectId.required(),
});
const fetchBasketValidate = joi.object({
  id: objectId,
  min: joi.number(),
  max: joi.number(),
});
const addBasketValidate = joi.object({
  id: objectId.required(),
  size: joi.number(),
  quntity: joi.number(),
  color: joi.number(),
});
module.exports = { handleBasketValidate, fetchBasketValidate,addBasketValidate };
