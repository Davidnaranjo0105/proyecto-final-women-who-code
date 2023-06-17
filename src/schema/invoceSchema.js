const Joi = require('joi');


const itemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(100000).required()
});

const invoiceSchema = Joi.object({
  createdAt: Joi.string().min(1).max(40).required(),
  items: Joi.array().min(1).max(10000).items(itemSchema).required()
});