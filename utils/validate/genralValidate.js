const joi = require("joi");
const removeValidate = joi.object({
  id: joi.string().required(),
});
const fetchOneValidate = joi.object({
  id: joi.string().required(),
});
module.exports = {
  fetchOneValidate,
  removeValidate,
};
