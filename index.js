const debug = require("debug")("app:startup");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");

const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const home = require("./routes/home");

const vidlyUrl = "mongodb://localhost:27017/vidly";

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}

mongoose
    .connect(vidlyUrl, { useNewUrlParser: true })
    .then(() => console.log("Connected to mongoDB"))
    .catch((ex) => console.log(ex));

const app = express();
app.set("view engine", "pug");
// app.set("views", "./views"); //default

app.use(express.json());

app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Enable morgan...");
}

// ********* LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
