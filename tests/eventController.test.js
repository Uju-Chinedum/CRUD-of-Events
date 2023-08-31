const {
  createEvent,
  getAllEvents,
  getEvent,
  deleteEventFromDayOfWeek,
  deleteEvent,
} = require("../controllers/eventController");
const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors");
const { confirmUser } = require("../utils");

jest.mock("../models/Event", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  deleteMany: jest.fn(),
  deleteOne: jest.fn(),
}));

jest.mock("../utils", () => ({
  confirmUser: jest.fn(),
}));

describe("createEvent", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        description: "Test Event",
        dayOfWeek: "saturday",
        userId: "user_id",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create an event and return 201 status code", async () => {
    Event.create.mockResolvedValue(req.body);

    await createEvent(req, res);

    expect(Event.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      event: {
        description: "Test Event",
        dayOfWeek: "saturday",
        userId: "user_id",
      },
    });
  });
});

describe("getAllEvents", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        dayOfWeek: "monday",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should get events for a specific day of the week", async () => {
    Event.find.mockResolvedValue([
      { description: "Event 1" },
      { description: "Event 2" },
    ]);

    await getAllEvents(req, res);

    expect(Event.find).toHaveBeenCalledWith({ dayOfWeek: "monday" });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      events: [{ description: "Event 1" }, { description: "Event 2" }],
      count: 2,
    });
  });

  it("should get all events if no events found for the specific day", async () => {
    Event.find.mockResolvedValue([]);

    await getAllEvents(req, res);

    expect(Event.find).toHaveBeenCalledWith({ dayOfWeek: "monday" });
    expect(Event.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({ events: [], count: 0 });
  });
});

describe("getEvent", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: "event_id",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should get a specific event", async () => {
    Event.findOne.mockResolvedValue({ description: "Test Event" });

    await getEvent(req, res);

    expect(Event.findOne).toHaveBeenCalledWith({ _id: "event_id" });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      event: { description: "Test Event" },
    });
  });

  it("should throw NotFound if event not found", async () => {
    Event.findOne.mockResolvedValue(null);

    await expect(getEvent(req, res)).rejects.toThrow(NotFound);

    expect(Event.findOne).toHaveBeenCalledWith({ _id: "event_id" });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("deleteEventFromDayOfWeek", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        dayOfWeek: "monday",
      },
      user: {
        userId: "user_id",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should throw NotFound if no events found to delete", async () => {
    Event.find.mockResolvedValue([]);

    await expect(deleteEventFromDayOfWeek(req, res)).rejects.toThrow(NotFound);

    expect(Event.find).toHaveBeenCalledWith({
      dayOfWeek: "monday",
      userId: "user_id",
    });
    expect(Event.deleteMany).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should delete events for a specific day of the week and user", async () => {
    Event.find.mockResolvedValue([
      { description: "Event 1" },
      { description: "Event 2" },
    ]);
    Event.deleteMany.mockResolvedValue({ deletedCount: 2 });

    await deleteEventFromDayOfWeek(req, res);

    expect(Event.find).toHaveBeenCalledWith({
      dayOfWeek: "monday",
      userId: "user_id",
    });
    expect(Event.deleteMany).toHaveBeenCalledWith({
      dayOfWeek: "monday",
      userId: "user_id",
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      msg: "List of deleted events for monday",
      deletedEvents: [{ description: "Event 1" }, { description: "Event 2" }],
    });
  });
});

describe("deleteEvent", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: "event_id",
      },
      user: {
        userId: "user_id",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should throw NotFound if event not found", async () => {
    Event.findOne.mockResolvedValue(null);

    await expect(deleteEvent(req, res)).rejects.toThrow(NotFound);

    expect(Event.findOne).toHaveBeenCalledWith({ _id: "event_id" });
    expect(confirmUser).not.toHaveBeenCalled();
    expect(Event.deleteOne).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should delete a specific event", async () => {
    Event.findOne.mockResolvedValue({
      description: "Test Event",
      userId: "user_id",
    });
    confirmUser.mockReturnValue(undefined);
    Event.deleteOne.mockResolvedValue({});

    await deleteEvent(req, res);

    expect(Event.findOne).toHaveBeenCalledWith({ _id: "event_id" });
    expect(confirmUser).toHaveBeenCalledWith("user_id", "user_id");
    expect(Event.deleteOne).toHaveBeenCalledWith({ _id: "event_id" });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(res.send).toHaveBeenCalledWith("Event deleted");
  });
});
