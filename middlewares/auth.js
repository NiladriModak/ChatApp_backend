const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandlerFunc");
exports.isauthenticated = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      //   console.log(token);
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id);
      next();
    } else {
      next(new ErrorHandler("Not authorized", 400));
    }
  } catch (error) {
    next(error);
  }
};
