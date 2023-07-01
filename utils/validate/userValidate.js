const joi = require("joi");
const addUserValidate = joi.object({
  firstName: joi.string().min(1).max(50).required(),
  lastName: joi.string().min(1).max(50).required(),
  email: joi.email({ minDomainSegments: 2, allow: ["com", "net"] }).required(),
  password: joi.string().min(8).max(50),
  role: joi.string().valid("client", "admin"),
  tel: joi.pattern(new RegExp("/^(+d{1,2}s)?(?d{3})?[s.-]d{3}[s.-]d{4}$/")),
  photo: joi.string().trim().required(),
  sex: joi.string().valid("Female", "Male").required(),
});
const removeUserValidate = joi.object({
  idClient:joi.string().required()
});
const updateUserValidate = joi.object({
  firstName: joi.string().min(1).max(50).required(),
  lastName: joi.string().min(1).max(50).required(),
  email: joi.email({ minDomainSegments: 2, allow: ["com", "net"] }).required(),
  password: joi.string().min(8).max(50),
  tel: joi.pattern(new RegExp("/^(+d{1,2}s)?(?d{3})?[s.-]d{3}[s.-]d{4}$/")),
  photo: joi.string().trim().required(),
});