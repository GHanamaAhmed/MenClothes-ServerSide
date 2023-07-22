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
module.exports = { handleBasketValidate, fetchBasketValidate };
