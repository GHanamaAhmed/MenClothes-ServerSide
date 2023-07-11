const joi = require("joi");
const { objectId } = require("./validateObjctId");
const addReelValidate = joi.object({
  name: joi.string().max(50),
  productId:objectId,
  video: joi.any(),
});
const updateReelValidate = joi.object({
  id: objectId.required(),
  name: joi.string().max(50),
  productId:objectId,
  video: joi.any(),
});
const likeReelValidate = joi.object({
  idUser: objectId.required(),
  idReel: objectId.required(),
});
const commentReelValidate = joi.object({
  idUser: objectId.required(),
  idReel: objectId.required(),
  toUserId: joi.string(),
});
const shareReelValidate = joi.object({
  idUser: objectId.required(),
  idReel: objectId.required(),
});
module.exports = {
  addReelValidate,
  updateReelValidate,
  likeReelValidate,
  commentReelValidate,
  shareReelValidate,
};
