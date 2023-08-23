const express = require("express");
const {
    createEvent,
    getAllEvents,
    getEvent,
    deleteEventFromDayOfWeek,
    deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

router
    .route("/")
    .post(createEvent)
    .get(getAllEvents)
    .delete(deleteEventFromDayOfWeek);

router.route("/:id").get(getEvent).delete(deleteEvent);

module.exports = router
