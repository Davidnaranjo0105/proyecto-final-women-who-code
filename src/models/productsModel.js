const mongoose = require("mongoose");
const ProductsSchema = mongoose.Schema({
  name: { type: String, require: true },
	description: { type: String, require: false },
	quantity: { type: Number, require: true},
	price: { type: Number  , require: true },
    inventory: { type: Number  , require: false },
});
const Product = mongoose.model('products',ProductsSchema)
module.exports = Product