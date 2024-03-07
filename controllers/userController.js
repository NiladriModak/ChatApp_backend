const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandlerFunc");
const sendToken = require("../utils/sendToken");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const usr = await User.findOne({ email });
    // console.log(usr)
    if (usr) {
      return next(new ErrorHandler("User Already Exists", 404));
    }

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all feild to register"));
    }
    const user = await User.create({ name, email, password });
    //await user.save();
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email | !password) {
      return next(new ErrorHandler("Fill all feilds to login", 404));
    }

    const usr = await User.findOne({ email }).select("+password");
    if (!usr) {
      return next(new ErrorHandler("User Does Not Exist", 404));
    }

    const matchPassword = await bcrypt.compare(password, usr.password);
    if (!matchPassword) {
      return next(new ErrorHandler("Please enter correct password", 404));
    }

    sendToken(usr, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};
