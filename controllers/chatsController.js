const Chat = require("../model/chatModel");
const userModel = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandlerFunc");

exports.accessChats = async (req, res, next) => {
  try {
    // console.log("umaa");
    const { userId } = req.body;
    var isChat = await Chat.find({
      //finding whether chat alreay exist or not and populate user ids
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("lastestMessage");

    //to get the senders id
    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (isChat.length > 0) {
      res.status(200).json({
        fullChat: isChat,
        success: true,
      });
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        _id: createChat._id,
      }).populate("users", "-password");
      res.status(201).json({
        fullChat,
      });
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

exports.fetchChats = async (req, res, next) => {
  try {
    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastestMessage")
      .sort({ updatedAt: -1 });
    if (result) {
      const newResult = await userModel.populate(result, {
        path: "lastestMessage.sender",
        select: "name pic email",
      });
      res.status(200).json({ newResult });
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

exports.createGroupChat = async (req, res, next) => {
  try {
    let { users, groupName } = req.body;
    if (!users || !groupName) {
      next(new ErrorHandler("Please enter all required feilds"));
    }
    users = JSON.parse(users);
    users.push(req.user);
    const createGroup = await Chat.create({
      isGroupChat: true,
      chatName: groupName,
      users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.find({ _id: createGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(201).json({
      fullGroupChat,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

exports.renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return next(new ErrorHandler("Group not found", 404));
    }
    res.status(200).json({
      updatedChat,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 404));
  }
};

exports.addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId)
      return next(new ErrorHandler("Enter all feilds", 404));
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updateChat) {
      return next(new ErrorHandler("Group Not Found", 404));
    }
    res.status(200).json({
      updateChat,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

exports.removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId)
      return next(new ErrorHandler("Enter all feilds", 404));
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updateChat) {
      return next(new ErrorHandler("Group Not Found", 404));
    }
    res.status(200).json({
      updateChat,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};
