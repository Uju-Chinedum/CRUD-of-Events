const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { passwordConfirm, createJWT } = require("../utils");
const { BadRequest, Unauthenticated } = require("../errors");

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
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide all details");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthenticated("Invalid email");
  }

  const checkPassword = await user.comparePassword(password);
  if (!checkPassword) {
    throw new Unauthenticated("Incorrect Password");
  }

  const payload = { userId: user._id, email };
  const token = createJWT({ payload });

  res.status(StatusCodes.OK).json({
    message: "User logged in successfully",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    token,
  });
};

module.exports = { createUser, login };
