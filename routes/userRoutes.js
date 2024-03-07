const express = require("express");
const { register, login, allUsers } = require("../controllers/userController");
const { isauthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/allUsers").get(isauthenticated, allUsers);
module.exports = router;
