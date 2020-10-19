const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const { bookmarks } = require("../src/store");

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
.route('/bookmarks')
.get((req,res) => {
    res.json(bookmarks);
})
.post(bodyParser, (req,res) => {
    const { title, url, rating, desc } = req.body;

    if(!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Bookmark title must be supplied");
    }

    if(!url) {
      logger.error(`Invalid url '${url}' supplied.`);
      return res.status(400).send("URL must be a valid url");
    }

    if(!desc) {
        logger.error(`Description is required.`);
        return res.status(400).send("Bookmark description must be supplied");
    }

    if(!Number.isInteger(rating)) {
      logger.error(`Invalid rating '${rating}' supplied.`);
      return res.status(400).send("Rating must be a number between 0 and 5");
    }

    const bookmark = {
      id: uuid(),
      title,
      url,
      description,
      rating,
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark);
});

bookmarksRouter
.route("/bookmarks/:id")
.get((req,res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((bookmark) => bookmark.id == id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Bookmark Not Found");
    }
   
    res.json(bookmark);
})
.delete((req,res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id == id);

    if (bookmarkIndex === -1){
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Not Found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);
    res.status(204).end();
})

module.exports = bookmarksRouter;