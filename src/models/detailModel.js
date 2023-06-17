const mongoose = require("mongoose");
const detailtSchema = new Schema({
    name: { type: String, required: true },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarShop' }
    //productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products' }
  });
  
  const Detail = mongoose.model('Items', detailtSchema)
  module.exports = Detail