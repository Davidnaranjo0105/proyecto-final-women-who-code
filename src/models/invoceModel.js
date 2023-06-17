const mongoose = require("mongoose");
const invoiceSchema = mongoose.Schema({
    createdAt: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [ {productId: {type: mongoose.Types.ObjectId, ref: 'products'}, quantity: {type: String, required: true} } ]
  });
  
  const Invoice = mongoose.model('invoices',  invoiceSchema)
  module.exports = Invoice 