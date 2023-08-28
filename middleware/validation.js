const joi = require("joi");
const { BadRequest } = require("../errors");

const userValidationSchema = joi.object({
  firstName: joi.string().required().trim(),
  lastName: joi.string().required().trim(),
  city: joi.string().required().trim(),
  country: joi.string().required().trim(),
  email: joi.string().required().email(),
  password: joi.string().required().min(6),
  confirmPassword: joi.string().required().min(6),
});

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    throw new BadRequest("Validation Error", error.details[0].message);
  }
  next();
};

const eventValidationSchema = joi.object({
  description: joi.string().required().trim().max(1024),
  dayOfWeek: joi
    .string()
    .required()
    .valid(
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ),
  userId: joi.string().required(),
});

const validateEvent = (req, res, next) => {
  req.body.userId = req.user.userId;

  const { error } = eventValidationSchema.validate(req.body);
  if (error) {
    throw new BadRequest("Validation Error", error.details[0].message);
  }
  next();
};

module.exports = { validateUser, validateEvent };
