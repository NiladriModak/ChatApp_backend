const app = require("./app.js");
const connectdb = require("./config/connectDb.js");
connectdb(); //connecting mongodb
const server = app.listen(80, () => {
  console.log("Listening on port number 80");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat-app-frontend-psi-ten.vercel.app/",
  },
});
io.on("connection", (socket) => {
  //   console.log("connection made successfully");
  //self connection
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  //creating room joining chat
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    // console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.user not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
