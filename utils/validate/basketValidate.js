const joi = require("joi");
const handleBasketValidate = joi.object({
  id: joi.string().required(),
});
const fetchBasketValidate = joi.object({
  id: joi.string().required(),
  min: joi.number(),
  max: joi.number(),
});
module.exports = { handleBasketValidate, fetchBasketValidate };
