const ErrorHandler = require("../utils/ErrorHandlerFunc");
const Message = require("../model/messageModel");
const userModel = require("../model/userModel");
const chatModel = require("../model/chatModel");
exports.sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return next(new ErrorHandler("Internal error", 500));
    }
    var newmessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
    var message = await Message.create(newmessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await chatModel.findByIdAndUpdate(req.body.chatId, {
      lastestMessage: message,
    });
    res.status(200).json(message);
  } catch (error) {
    next("Error");
  }
};

exports.fetchAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email pic")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
