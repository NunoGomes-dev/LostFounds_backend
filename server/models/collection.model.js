const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  productId: String,
  userId: String,
  date: Date,
});

const collection = mongoose.model("collections", collectionSchema);

module.exports = collection;
