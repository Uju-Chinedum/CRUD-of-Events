const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class Unauthenticated extends CustomError {
  constructor(error, message) {
    super(message);
    this.error = error;
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthenticated;
