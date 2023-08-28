const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEvent,
  deleteEventFromDayOfWeek,
  deleteEvent,
} = require("../controllers/eventController");
const { validateEvent } = require("../middleware/validation");

const router = express.Router();

router.route("/:dayOfWeek?").get(getAllEvents).delete(deleteEventFromDayOfWeek);

router.route("/").post(validateEvent, createEvent);

router.route("/:id").get(getEvent).delete(deleteEvent);

module.exports = router;
