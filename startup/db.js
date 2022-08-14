const winston = require("winston");
const mongoose = require("mongoose");

const vidlyUrl = "mongodb://localhost:27017/vidly";

module.exports = function () {
    mongoose
        .connect(vidlyUrl, { useNewUrlParser: true })
        .then(() => winston.info("Connected to mongoDB..."));
    // .catch((ex) => console.log("Could not connect to mongoDB", ex));
};
