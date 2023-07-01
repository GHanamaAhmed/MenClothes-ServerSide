const joi = require("joi");
const addReelValidate = joi.object({
  name: joi.string().min(1).max(50),
  productId: joi.string(),
  video: joi.any().required(),
});
const removeReelValidate = joi.object({
  idReel: joi.string().required(),
});
const likeReelValidate = joi.object({
  idUser: joi.string().min(1).max(50),
  idReel: joi.string(),
  video: joi.any().required(),
});
const commentReelValidate = joi.object({
  idUser: joi.string().required(),
  idReel: joi.string().required(),
  toUserId: joi.string(),
});
