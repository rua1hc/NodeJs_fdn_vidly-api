const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");
const config = require("config");

module.exports = function () {
    const vidlyDbUrl = config.get("db");

    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: "exceptions.log" })
    );

    // process.on("uncaughtException", (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    process.on("unhandledRejection", (ex) => {
        // winston.error(ex.message, ex);
        // process.exit(1);
        throw ex;
    });

    winston.add(winston.transports.File, { filename: "logfile.log" });
    // winston.add(winston.transports.MongoDB, {
    //     db: vidlyDbUrl,
    //     level: "info",
    // });
};
