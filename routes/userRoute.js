const express = require("express");
const { createUser, login } = require("../controllers/userController");

const router = express.Router();

router.post("/sign-up", createUser);
router.post("/sign-in", login);

module.exports = router;
