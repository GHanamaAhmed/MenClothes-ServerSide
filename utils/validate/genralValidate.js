const joi = require("joi");
const removeValidate = joi.object({
  id: joi.string().required(),
});
const fetchOneValidate = joi.object({
  id: joi.string().required(),
});
const photoValidate = joi.object({
  type:joi.string().required(),
  folderName:joi.string().required(),
  fileName:joi.string().required(),
});

module.exports = {
  photoValidate,
  fetchOneValidate,
  removeValidate,
};
