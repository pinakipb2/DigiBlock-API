import Joi from 'joi';

const masterKeySchema = Joi.object({
  masterKey: Joi.string().trim().required(),
  masterKeyHash: Joi.string().trim().required(),
});

export default masterKeySchema;
