const User = require("../models/user.model");

module.exports = {
  async getAll() {
    try {
      const users = await User.find();
      return users;
    } catch (err) {
      throw "Error getting users ( " + err + " ) ";
    }
  },
  async getByEmailWithPassword({ email }) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw "Not found";
      return user;
    } catch (error) {
      throw "Error getting user by email: " + email + " ( " + error + " ) ";
    }
  },
  async create(userData) {
    try {
      const found = await User.findOne({
        email: userData.email,
      });
      if (found) {
        throw `User with the email ${userData.email} already exists`;
      }

      const result = await User.create({ ...userData });
      delete result?.password;
      return result;
    } catch (err) {
      throw "Error creating user ( " + err + " ) ";
    }
  },
};
