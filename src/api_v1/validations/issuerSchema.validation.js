import Joi from 'joi';

const issuerSchema = Joi.object({
  orgName: Joi.string().trim().required(),
  address: Joi.string().lowercase().trim().required(),
  docType: Joi.array().items(Joi.string()).required(),
});

export default issuerSchema;
