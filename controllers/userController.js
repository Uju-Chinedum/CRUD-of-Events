const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { passwordConfirm } = require("../utils");
const { BadRequest } = require("../errors");

const createUser = async (req, res) => {
    const { password, confirmPassword } = req.body;

    const isSamePassword = passwordConfirm(password, confirmPassword);
    if (!isSamePassword) {
        throw new BadRequest("password does not match confirmPassword");
    }

    const user = await User.create(req.body);

    res.status(StatusCodes.CREATED).send("User Created");
};

const login = async (req, res) => {
    res.send("login");
};

module.exports = { createUser, login };
