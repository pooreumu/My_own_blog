const Joi = require("joi");

const UsersSchema = Joi.object({
  nickname: Joi.string().required().min(3).alphanum(),
  password: Joi.string().required().min(4),
  confirmPassword: Joi.string().required().min(4),
});

module.exports = UsersSchema;
