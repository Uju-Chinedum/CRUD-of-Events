const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    error: err.error || "Internal Server Error",
    message: err.message || "Something went wrong!! Please try again later.",
  };

  if (err.name === "ValidationError") {
    customError.error = "Validation Error";
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.error = "Duplicate Values";
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field. Please use another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.error = "Not Found";
    customError.message = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json(customError);
};

module.exports = errorHandler;
