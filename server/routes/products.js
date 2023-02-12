const router = require("express").Router();
const controller = require("../controllers/product.controller");

const auth = require("../middleware/auth");

router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
router.delete("/", auth, controller.delete);

module.exports = router;
