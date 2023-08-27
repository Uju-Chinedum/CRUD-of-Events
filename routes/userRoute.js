const express = require("express");
const { createUser, login } = require("../controllers/userController");
const { validateUser } = require("../middleware/validation");

const router = express.Router();

router.post("/sign-up", validateUser, createUser);
router.post("/sign-in", login);

module.exports = router;
