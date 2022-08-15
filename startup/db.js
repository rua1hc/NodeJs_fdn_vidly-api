const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
    // const db = "mongodb://localhost:27017/vidly";
    const db = config.get("db");
    mongoose
        .connect(db, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to ${db}...`));
    // .catch((ex) => console.log("Could not connect to mongoDB", ex));

    // process.on("exit", function () {
    //     mongoose.disconnect();
    // });
};
