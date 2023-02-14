const Product = require("../models/product.model");

module.exports = {
  async getAll(query) {
    try {
      const products = await Product.find(query);
      return products;
    } catch (err) {
      throw "Error getting products ( " + err + " ) ";
    }
  },
  async createProduct(product) {
    try {
      const result = await Product.create(product);
      return result;
    } catch (error) {
      throw "Error creating product ( " + error + " ) ";
    }
  },
  async deleteProduct(name) {
    try {
      const { deletedCount } = await Product.deleteOne({ name: name });
      if (deletedCount === 0) throw "Not found";
      return true;
    } catch (error) {
      throw "Error deleting product ( " + error + " ) ";
    }
  },
};
