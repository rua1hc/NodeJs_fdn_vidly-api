const debug = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");

const home = require("./routes/home");
const genres = require("./routes/genres");

const app = express();

app.set("view engine", "pug");

app.use("/", home);
app.use("/api/genres", genres);

// ********* ENV
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get("env")}`);
debug("App name: " + config.get("name"));
// console.log("App name:", config.get("name"));
debug("Mail: " + config.get("mail.host"));
debug("Mail pw: " + config.get("mail.password"));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use(function (req, res, next) {
// console.log('logging...')
//     next();
// });

app.use(helmet());

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Enable mogrgan...");
}

// ********* LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => dbDebugger(`Listening on port ${port}`));
