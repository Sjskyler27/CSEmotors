const express = require("express");
const router = new express.Router();
const watchlistController = require("../controllers/watchlistController");
const utilities = require("../utilities");

router.get("/", watchlistController.buildWatchlistBylocal);

module.exports = router;
