import Joi from 'joi';

const addressSchema = Joi.object({
  address: Joi.string().lowercase().min(30).max(50).trim().required(),
});
export default addressSchema;
