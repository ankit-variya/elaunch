const Joi = require("joi");

exports.postsValidationSchema = Joi.object().keys({
  firstname: Joi.string().error(new Error("add your firstname")).required(),
  lastname: Joi.string().error(new Error("add your lastname")).required(),
  email: Joi.string().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).error(new Error("add your email")).required(),
  password: Joi.string().error(new Error("add your password")).required(),
  mobile: Joi.string().error(new Error("add your mobile")).required(),
  gender: Joi.string().error(new Error("add your gender")).required(),
  country: Joi.string().error(new Error("add your country")),
  state: Joi.string().error(new Error("add your state"))
});

exports.loginValidationSchema = Joi.object().keys({
  email: Joi.string().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).error(new Error("add your email")),
  password: Joi.string().error(new Error("add your password")).required(),
  mobile: Joi.string().error(new Error("add your mobile")),
});
