const passwordConfirm = require("./passwordConfirm");
const { createJWT, verifyToken } = require("./jwt");
const confirmUser = require("./confirmUser");

module.exports = { passwordConfirm, createJWT, verifyToken, confirmUser };
