const express = require("express");
const router = new express.Router();
const watchlistController = require("../controllers/watchlistController");
const utilities = require("../utilities");

router.get("/", watchlistController.buildWatchlistBylocal);

router.get(
  "/remove/:id",
  utilities.handleErrors(watchlistController.processRemove)
);
router.get("/add/:id", utilities.handleErrors(watchlistController.processAdd));

module.exports = router;
