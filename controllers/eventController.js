const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors");
const { confirmUser } = require("../utils");

const createEvent = async (req, res) => {
  const event = await Event.create(req.body);

  res.status(StatusCodes.CREATED).json({ event });
};

const getAllEvents = async (req, res) => {
  const { dayOfWeek } = req.params;

  let events = await Event.find({ dayOfWeek });
  if (events.length === 0) {
    events = await Event.find({});
  }

  res.status(StatusCodes.OK).json({ events, count: events.length });
};

const getEvent = async (req, res) => {
  const { id: eventId } = req.params;

  const event = await Event.findOne({ _id: eventId });
  if (!event) {
    throw new NotFound("Not Found", "Not found");
  }

  res.status(StatusCodes.OK).json({ event });
};

const deleteEventFromDayOfWeek = async (req, res) => {
  const { dayOfWeek } = req.params;
  const { userId } = req.user;

  const events = await Event.find({ dayOfWeek, userId });

  if (events.length === 0) {
    throw new NotFound("Not Found", "Not found");
  }

  const deletedEvents = await Event.deleteMany({ dayOfWeek, userId });

  res.status(StatusCodes.OK).json({
    msg: `List of deleted events for ${dayOfWeek}`,
    deletedEvents: events,
  });
};

const deleteEvent = async (req, res) => {
  const { id: eventId } = req.params;

  const event = await Event.findOne({ _id: eventId });
  if (!event) {
    throw new NotFound("Not Found", "Not found");
  }

  confirmUser(req.user.userId, event.userId);

  await Event.deleteOne({ _id: eventId });

  res.status(StatusCodes.NO_CONTENT).send("Event deleted");
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  deleteEventFromDayOfWeek,
  deleteEvent,
};
