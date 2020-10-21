const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const { bookmarks } = require("../store");

const bookmarksRouter = express.Router();
const bodyParser = express.json(); //allows us to grab stuff from req.body and changes it to JSON for us

bookmarksRouter
.route('/bookmarks')
.get((req,res) => {
  res.json(bookmarks); 
})
.post(bodyParser, (req,res) => {
    const { title, url, rating, description } = req.body;

    if(!title) {
      logger.error(`Title is required`); //be more specific on logger. If sopmething goes wrong we want to know exactly why. We also can gain info from being verbose on successful requests
      return res.status(400).send("Bookmark title must be supplied");
    }

    if(!url) {
      logger.error(`Invalid url '${url}' supplied.`);
      return res.status(400).send("URL must be a valid url");
    }

    if(!description) {
      logger.error(`Description is required.`);
      return res.status(400).send("Bookmark description must be supplied");
    }

    if(!Number.isInteger(rating)) {
      logger.error(`Invalid rating '${rating}' supplied.`);
      return res.status(400).send("Rating must be a number between 0 and 5");
    }

    const bookmark = {
      id: uuid(),
      title, //same as title: title
      url,
      description, 
      rating,
    };

    bookmarks.push(bookmark);
    console.log(uuid());

    logger.info(`Bookmark with id ${id} created`);

    res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark); //location is a header that is sent to the client that tells you where to access the particular resource
    //json(bookmark) is not a header its part of the body of the response.
});

bookmarksRouter
.route("/bookmarks/:id")
.get((req,res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((bookmark) => bookmark.id == id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Bookmark Not Found");   //unsuccessful request does not equal a server error 
    }
    res.json(bookmark);
})
.delete((req,res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id == id); //if findIndex doesnt find the index we want it will return -1

    if (bookmarkIndex === -1){
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Not Found");
    }

    bookmarks.splice(bookmarkIndex, 1); //to delete something from an array we need to use splice. Filter never removes. It generates a new array with the filtering criteria.

    logger.info(`Bookmark with id ${id} deleted.`);
    res.status(204).end();
})

module.exports = bookmarksRouter;
