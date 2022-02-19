import Joi from 'joi';

const userSendEmailSchema = Joi.object({
  name: Joi.string().trim().min(2).max(70).required(),
  email: Joi.string().lowercase().trim().email().required(),
  masterKey: Joi.string().trim().required(),
});

export default userSendEmailSchema;
