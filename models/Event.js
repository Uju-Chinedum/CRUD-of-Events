const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please provide a description of the event"],
      trim: true,
      maxlength: 1024,
    },
    dayOfWeek: {
      type: String,
      required: [true, "Please provide a day of the week for the event"],
      enum: {
        values: [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ],
        message: "{VALUE} is not a valid day of the week",
      },
      default: "saturday",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
