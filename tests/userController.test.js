const { createUser, login } = require("../controllers/userController");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, Unauthenticated } = require("../errors");
const { passwordConfirm, createJWT } = require("../utils");

jest.mock("../models/User", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../utils", () => ({
  passwordConfirm: jest.fn(),
  createJWT: jest.fn(),
}));

describe("createUser", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should create a user and return 201 status code", async () => {
    passwordConfirm.mockReturnValue(true);
    User.create.mockResolvedValue({});

    await createUser(req, res);

    expect(passwordConfirm).toHaveBeenCalledWith("password123", "password123");
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.send).toHaveBeenCalledWith("User Created");
  });

  it("should throw BadRequest if passwords do not match", async () => {
    passwordConfirm.mockReturnValue(false);

    await expect(createUser(req, res)).rejects.toThrow(BadRequest);

    expect(passwordConfirm).toHaveBeenCalledWith("password123", "password123");
    expect(User.create).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});

describe("login", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        email: "john@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should log in a user and return a JWT token", async () => {
    const user = {
      _id: "user_id",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(user);
    createJWT.mockReturnValue("mockedToken");

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(user.comparePassword).toHaveBeenCalledWith("password123");
    expect(createJWT).toHaveBeenCalledWith({
      payload: { userId: "user_id", email: "john@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      message: "User logged in successfully",
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      token: "mockedToken",
    });
  });

  it("should throw Unauthenticated if email is invalid", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(login(req, res)).rejects.toThrow(Unauthenticated);

    expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw Unauthenticated if password is invalid", async () => {
    const user = {
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockResolvedValue(user);

    await expect(login(req, res)).rejects.toThrow(Unauthenticated);

    expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    expect(user.comparePassword).toHaveBeenCalledWith("password123");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw BadRequest if email or password is missing", async () => {
    req.body.email = "";
    req.body.password = "";

    await expect(login(req, res)).rejects.toThrow(BadRequest);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
