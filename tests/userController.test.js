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
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        password: "secret",
        confirmPassword: "secret",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should throw BadRequest if passwords do not match", async () => {
    passwordConfirm.mockReturnValue(false);

    await expect(createUser(req, res)).rejects.toThrow(BadRequest);

    expect(passwordConfirm).toHaveBeenCalledWith("secret", "secret");
    expect(User.create).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should create a user and return 201 status code", async () => {
    passwordConfirm.mockReturnValue(true);
    User.create.mockResolvedValue({});

    await createUser(req, res);

    expect(passwordConfirm).toHaveBeenCalledWith("secret", "secret");
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.send).toHaveBeenCalledWith("User Created");
  });
});

describe("login", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@test.com",
        password: "secret",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should throw BadRequest if email or password is missing", async () => {
    req.body.email = "";
    req.body.password = "";

    await expect(login(req, res)).rejects.toThrow(BadRequest);

    expect(User.findOne).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should log in a user and return a JWT token", async () => {
    const user = {
      _id: "user_id",
      firstName: "Test",
      lastName: "User",
      email: "test@test.com",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(user);
    createJWT.mockReturnValue("mockedToken");

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(user.comparePassword).toHaveBeenCalledWith("secret");
    expect(createJWT).toHaveBeenCalledWith({
      payload: { userId: "user_id", email: "test@test.com" },
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      message: "User logged in successfully",
      user: {
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
      },
      token: "mockedToken",
    });
  });

  it("should throw Unauthenticated if email is invalid", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(login(req, res)).rejects.toThrow(Unauthenticated);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should throw Unauthenticated if password is invalid", async () => {
    const user = {
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockResolvedValue(user);

    await expect(login(req, res)).rejects.toThrow(Unauthenticated);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(user.comparePassword).toHaveBeenCalledWith("secret");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
