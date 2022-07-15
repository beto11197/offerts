const UserController = require("../controllers/users");
const express = require("express");

const router = express.Router();

router.post("/login", UserController.login );

router.post("/add", UserController.addUser );

module.exports = router;