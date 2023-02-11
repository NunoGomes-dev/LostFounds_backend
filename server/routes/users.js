const router = require("express").Router();
const controller = require("../controllers/user.controller");

const auth = require("../middleware/auth");

router.get("/", auth, controller.list);

router.post("/register/client", controller.registerClient);
router.post("/register/agent", controller.registerAgent);

router.post("/sign-in", controller.signIn);

module.exports = router;
