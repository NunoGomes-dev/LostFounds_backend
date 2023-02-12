const ProductService = require("../services/product.service");
const { validateRequired, getCurrentDate } = require("../utils");

module.exports = {
  async list(req, res) {
    try {
      const products = await ProductService.getAll();
      return res.status(200).send(products);
    } catch (err) {
      return res.status(500).send({ err });
    }
  },
  async create(req, res) {
    const fields = ["name", "type", "description", "created_at"];
    const newProduct = {
      ...req.body,
      created_at: getCurrentDate(),
    };
    validateRequired(fields, newProduct, res);

    try {
      const product = await ProductService.createProduct(newProduct);
      return res.status(200).send(product);
    } catch (err) {
      return res.status(500).send({ err });
    }
  },
  async delete(req, res) {
    const name = req.query.name;
    if (!name) {
      return res.status(500).send(`Name missing in parameters!`);
    }
    try {
      await ProductService.deleteProduct(name);
      return res.status(200).send("Deleted");
    } catch (err) {
      return res.status(500).send({ err });
    }
  },
};
