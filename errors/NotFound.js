const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class NotFound extends CustomError {
  constructor(error, message) {
    super(message);
    this.error = error;
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFound;
