const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class BadRequest extends CustomError {
  constructor(error, message) {
    super(message);
    this.error = error;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
