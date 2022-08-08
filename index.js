const debug = require("debug")("app:startup");

const mongoose = require("mongoose");
const config = require("config");
const morgan = require("morgan");
const express = require("express");

const home = require("./routes/home");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

const vidlyUrl = "mongodb://localhost/vidly";

mongoose
    .connect(vidlyUrl)
    .then(() => console.log("Connected to mongoDB"))
    .catch((ex) => console.log(ex));

const app = express();
app.set("view engine", "pug");
// app.set("views", "./views"); //default

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/", home);

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Enable morgan...");
}

// ********* LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
