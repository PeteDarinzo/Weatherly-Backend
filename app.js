"use strict"

/** Express app for weatherly */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
// parse request bodies for JSON
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/users", userRoutes);


/** Handle 404 errors - this matches everything */

app.use((req, res, next) => {
  next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */

app.use((err, req, res, next) => {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});

module.exports = app;