const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");

dotenv.config();

// CORS middleware configuration
app.use(
  cors({
    origin: "https://chat-front-mu.vercel.app",
    credentials: true,
  })
);

// Other middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api/message", messageRoutes);

// Error middleware
app.use(errorMiddleware);

module.exports = app;
