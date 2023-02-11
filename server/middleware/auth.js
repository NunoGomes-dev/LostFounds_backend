require("dotenv/config");
const jwt = require("jsonwebtoken");

const getAuth = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ msg: "Auth token not found!" });
  }

  const parts = authToken.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ erro: "Auth token incomplete!" });
  }

  const [prefix, token] = parts;

  if (!/^Bearer_lf$/i.test(prefix))
    return res.status(401).send({ erro: "Auth token bad format!" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid Permissions" });
  }
};

module.exports = getAuth;
