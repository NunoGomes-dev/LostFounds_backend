const ProductService = require("../services/product.service");
const {
  validateRequired,
  formatDate,
  QueryBuilder,
  handleComplexSearchQuery,
} = require("../utils");

const productFields = {
  name: "String",
  type: "String",
  description: "String",
  color: "String",
  brand: "String",
  created_at: "Date",
};

const complexSearchKeys = ["name", "color", "brand"];

module.exports = {
  async list(req, res) {
    try {
      const { search, ...query } = req.query;
      const filters = {
        ...QueryBuilder(query, productFields),
        ...handleComplexSearchQuery(search, complexSearchKeys),
      };

      const products = await ProductService.getAll({ ...filters });
      return res.status(200).send(products);
    } catch (err) {
      console.log("error", err);
      return res.status(500).send({ err });
    }
  },
  async create(req, res) {
    const fields = ["name", "type", "description", "created_at"];
    const newProduct = {
      ...req.body,
      created_at: new Date(),
    };
    validateRequired(fields, newProduct, res);

    try {
      const product = await ProductService.createProduct(newProduct);
      return res.status(200).send(product);
    } catch (err) {
      console.log("error", err);
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
