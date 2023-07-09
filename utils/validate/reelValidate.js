const joi = require("joi");
const addReelValidate = joi.object({
  name: joi.string().max(50),
  productId: joi.string(),
  video: joi.any(),
});
const updateReelValidate = joi.object({
  id: joi.string().required(),
  name: joi.string().max(50),
  productId: joi.string(),
  video: joi.any(),
});
const likeReelValidate = joi.object({
  idUser: joi.string().required(),
  idReel: joi.string().required(),
});
const commentReelValidate = joi.object({
  idUser: joi.string().required(),
  idReel: joi.string().required(),
  toUserId: joi.string(),
});
const shareReelValidate = joi.object({
  idUser: joi.string().required(),
  idReel: joi.string().required(),
});
module.exports = {
  addReelValidate,
  updateReelValidate,
  likeReelValidate,
  commentReelValidate,
  shareReelValidate,
};
