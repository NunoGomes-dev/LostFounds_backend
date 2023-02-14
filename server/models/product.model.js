const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  color: String,
  brand: String,
  created_at: Date,
});

const product = mongoose.model("products", productSchema);

module.exports = product;
