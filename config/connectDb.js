const mongoose = require("mongoose");
const connectdb = () => {
  mongoose
    .connect(process.env.MONGODBURL, {
      dbName: "EConnect",
    })
    .then((data) => {
      console.log("Connected to db ", data.connection.host);
    });
};
module.exports = connectdb;
