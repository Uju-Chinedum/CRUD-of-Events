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

router.route("/").post(validateEvent, createEvent);

router.route("/day/:dayOfWeek?").get(getAllEvents);

router.route("/day/:dayOfWeek").delete(deleteEventFromDayOfWeek);

router.route("/:id").get(getEvent).delete(deleteEvent);

module.exports = router;
