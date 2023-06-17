const productsSchema = Joi.object({
    name: Joi.string().min(1).max(80).required(),
    description: Joi.string().min(1).max(80).optional(),
    quantity: Joi.number().min(1).max(10000).integer().required(),
    price: Joi.number().min(1).max(10000000).required(),
    inventory: Joi.number().min(1).max(100000).optional()
  });