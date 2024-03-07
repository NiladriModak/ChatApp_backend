const express = require("express");
const { isauthenticated } = require("../middlewares/auth");
const {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatsController");
const router = express.Router();

router.route("/chats").post(isauthenticated, accessChats);
router.route("/chats").get(isauthenticated, fetchChats);
router.route("/chats/createGroup").post(isauthenticated, createGroupChat);
router.route("/chats/renameGroup").put(isauthenticated, renameGroup);
router.route("/chats/addToGroup").put(isauthenticated, addToGroup);
router.route("/chats/removeFromGroup").put(isauthenticated, removeFromGroup);

module.exports = router;
