const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const createUser = async (req, res) => {
    res.send("create user");
};

const login = async (req, res) => {
    res.send("login");
};

module.exports = { createUser, login };
