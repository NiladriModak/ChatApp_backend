const express = require("express");
const { isauthenticated } = require("../middlewares/auth");
const {
  sendMessage,
  fetchAllMessages,
} = require("../controllers/messageController");

const router = express.Router();
router.route("/").post(isauthenticated, sendMessage);
router.route("/:chatId").get(isauthenticated, fetchAllMessages);
module.exports = router;
