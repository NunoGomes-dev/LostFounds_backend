const router = require("express").Router();

router.use("/", async (req, res) => {
  try {
    return res.status(200).send({ msg: "Lost and Founds API | Unassigned!" });
  } catch (err) {
    return res.status(500).send({ err, msg: "error" });
  }
});

module.exports = router;
