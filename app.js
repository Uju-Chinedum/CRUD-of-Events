require("dotenv").config();
require("express-async-errors");
const express = require("express");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const swagger = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDocs = yaml.load("./swagger.yaml");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authenticateUser = require("./middleware/authentication");
const userRouter = require("./routes/userRoute");
const eventRouter = require("./routes/eventRoute");

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.static("./public"));

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs));
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
