const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors");

const createEvent = async (req, res) => {
    req.body.userId = req.user.userId;
    const event = await Event.create(req.body);

    res.status(StatusCodes.OK).json({ event });
};

const getAllEvents = async (req, res) => {
    res.send("get all events");
};

const getEvent = async (req, res) => {
    const { id: eventId } = req.params;

    const event = await Event.findOne({ _id: eventId });
    if (!event) {
        throw new NotFound(`No event found for this id: ${eventId}`);
    }

    res.status(StatusCodes.OK).json({ event });
};

const deleteEventFromDayOfWeek = async (req, res) => {
    res.send("delete event from day of week");
};

const deleteEvent = async (req, res) => {
    const { id: eventId } = req.params;

    const event = await Event.findOne({ _id: eventId });
    if (!event) {
        throw new NotFound(`No event found for this id: ${eventId}`);
    }

    await event.remove();
    res.status(StatusCodes.NO_CONTENT).send("Event deleted");
};

module.exports = {
    createEvent,
    getAllEvents,
    getEvent,
    deleteEventFromDayOfWeek,
    deleteEvent,
};
