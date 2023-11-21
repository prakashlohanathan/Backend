const express = require("express");
const APP_SERVER = express();

// REGISTER ALL THE CONTROLLER IN APP SERVER

APP_SERVER.use("/auth", require("./Controller/Auth.controller"));
APP_SERVER.use("/recipe", require("./Controller/Recipes.controller"));
APP_SERVER.use("/users", require("./Controller/User.controller"));

module.exports = APP_SERVER;

// INJECTING DATABSE CONNECTION
 require("./Database/dbConfig");