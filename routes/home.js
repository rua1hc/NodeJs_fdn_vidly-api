const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "iExpress", message: "Main-course" });
});

module.exports = router;
