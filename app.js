const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");

dotenv.config();
app.use(
  cors({
    origin: "https://chat-app-frontend-psi-ten.vercel.app/",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require("./routes/userRoutes");
const chat = require("./routes/chatRoutes");
const message = require("./routes/messageRoutes");
app.use("/api", user);
app.use("/api", chat);
app.use("/api/message", message);
app.use(errorMiddleware);
module.exports = app;
