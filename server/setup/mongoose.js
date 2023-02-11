"use strict";
require("dotenv").config();

let mongoose = require("mongoose");

module.exports = setup;

function setup() {
  mongoose.connection.on("connected", function () {
    console.log("MongoDB connected to database.");
  });
  mongoose.connection.on("open", function () {
    console.log("MongoDB connection opened!");
  });
  mongoose.connection.on("error", function () {
    console.error("MongoDB connection error! Disconnecting...");
    mongoose.disconnect();
  });
  mongoose.connection.on("disconnected", function () {
    console.error("MongoDB disconnected! Attempting to reconnect...");
    connectToDb();
  });
  mongoose.connection.on("reconnected", function () {
    console.log("MongoDB reconnected!");
  });
  mongoose.connection.on("close", function () {
    console.error("MongoDB closed!");
  });

  return connectToDb().then(function () {
    // Set up all models.
    require("../models");
    return;
  });
}

function connectToDb() {
  // Use native promises.
  mongoose.Promise = global.Promise;

  // Mongoose connection options.
  const mongoConnectOpts = {
    sslValidate: true,
    checkServerIdentity: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
    ha: true, // Make sure the high availability checks are on
    haInterval: 10000, // Run every 10 seconds
  };

  // Connect and return promise.
  return mongoose
    .connect(process.env.DATABASE_URL, mongoConnectOpts)
    .catch(function (err) {
      // To avoid promise not handled exception.
      console.error(
        "ERRO: ",
        // "Unable to connect MongoDB. If problem persists, please restart the server. Error: " +
        err
      );
    });
}
