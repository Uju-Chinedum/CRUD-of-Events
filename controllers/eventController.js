const createEvent = (req, res) => {
    res.send("create event");
};

const getAllEvents = (req, res) => {
    res.send("get all events");
};

const getEvent = (req, res) => {
    res.send("get event");
};

const deleteEventFromDayOfWeek = (req, res) => {
    res.send("delete event from day of week");
};

const deleteEvent = (req, res) => {
    res.send("delete event");
};

module.exports = {
    createEvent,
    getAllEvents,
    getEvent,
    deleteEventFromDayOfWeek,
    deleteEvent,
};
