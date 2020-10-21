require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const bookmarksRouter = require("./bookmarks/bookmark-router");
const logger = require('./logger')

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//validation goes first in our pipeline
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN; //api keys unique to a user. api token used for all users
  const authToken = req.get("Authorization"); //Bearer 343456676787

  if (!authToken || authToken.split(" ")[1] !== apiToken) { //  Bearer (token). split reduces this into an array of 2 indices [ Bearer, token ] so we dont want bearer. We just want the token
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
});

//we want validation to occur before any routes are handled
app.use(bookmarksRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

// app.get('/', (req, res) => {
//   res.send('Hello, boilerplate!')
// })

module.exports = app;
