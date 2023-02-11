require("dotenv/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserService = require("../services/user.service");

const timeToExpire = 86400;

function generateToken(params = {}) {
  return jwt.sign(params, process.env.SECRET_KEY, {
    expiresIn: timeToExpire,
  });
}

module.exports = {
  async list(req, res) {
    try {
      const users = await UserService.getAll();
      return res.status(200).send(users);
    } catch (err) {
      return res.status(500).send({ err });
    }
  },
  async registerAgent(req, res) {
    const { name, email, password } = req.body;

    if (!name) return res.status(500).send("Invalid name");
    if (!email) return res.status(500).send("Invalid email");
    if (!password) return res.status(500).send("Invalid password");

    try {
      const hashedPw = await bcrypt.hash(password, 10);

      const user = await UserService.create({
        name,
        email: email.toLowerCase(),
        password: hashedPw,
        type: "Agent",
      });

      if (!user) return res.status(500).send("Error creating user");
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ err });
    }
  },
  async registerClient(req, res) {
    const { name, email, password } = req.body;
    if (!name) return res.status(500).send("Invalid name");
    if (!email) return res.status(500).send("Invalid email");
    if (!password) return res.status(500).send("Invalid password");

    try {
      const hashedPw = await bcrypt.hash(password, 10);

      const user = await UserService.create({
        name,
        email: email.toLowerCase(),
        password: hashedPw,
        type: "Client",
      });

      if (!user) return res.status(500).send("Error creating user");
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ err });
    }
  },
  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) return res.status(500).send("Invalid Email");
      if (!password) return res.status(500).send("Invalid password");

      let user = await UserService.getByEmailWithPassword({ email });

      const next = await bcrypt.compare(password, user.password);

      if (!next) {
        return res.status(401).send({ err: "Invalid credentials" });
      }

      const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      };

      return res.status(200).send({
        expiresIn: timeToExpire,
        accessToken: await generateToken(payload),
        user: { ...payload },
      });
    } catch (error) {
      console.log("error", error);
      return res.status(401).send({ error });
    }
  },
};
