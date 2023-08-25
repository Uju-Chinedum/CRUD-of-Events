const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors");
const { confirmUser } = require("../utils");

const createEvent = async (req, res) => {
  req.body.userId = req.user.userId;
  const event = await Event.create(req.body);

  res.status(StatusCodes.OK).json({ event });
};

const getAllEvents = async (req, res) => {
  const events = await Event.find({});
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
  const { dayOfWeek } = req.params;

  const events = Event.find({ dayOfWeek });
  if (!events) {
    throw new BadRequest(`No event scheduled for ${dayOfWeek}`);
  }

  confirmUser(req.user.userId, events.userId);
  await events.remove();

  res
    .status(StatusCodes.OK)
    .json({ msg: "List of deleted events", deletedEvents: [events] });
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
