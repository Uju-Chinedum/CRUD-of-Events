require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authenticateUser = require("./middleware/authentication");
const userRouter = require("./routes/userRoute");
const eventRouter = require("./routes/eventRoute");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", authenticateUser, eventRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
