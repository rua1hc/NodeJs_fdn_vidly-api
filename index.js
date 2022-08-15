const debug = require("debug")("app:startup");
const winston = require("winston");
const morgan = require("morgan");

const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();

require("./startup/db")();
require("./startup/apiValidation")();
require("./startup/routes")(app);
require("./startup/prod")(app);

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Enable morgan...");
}

// ********* LISTEN
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
    winston.info(`Listening on port ${port}`)
);

module.exports = server;
