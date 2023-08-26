const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class Unauthorized extends CustomError {
  constructor(error, message) {
    super(message);
    this.error = error;
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = Unauthorized;
