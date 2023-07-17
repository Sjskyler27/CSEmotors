const invModel = require("../models/watchlist-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildWatchlistBylocal = async function (req, res, next) {
  console.log("building watchlist");
  try {
    const data = await invModel.getInventoryFromWatchlist(); // build inventory based off new table based based on getInventoryByClassificationId
    let nav = await utilities.getNav();
    const watchlist = await utilities.buildWatchList(data); // expects similar to buildByClassificationId
    res.render("./watchlist/watchlist", {
      title: "Watchlist",
      nav,
      watchlist,
      errors: null,
    });
  } catch (error) {
    error.status = 500;
    console.error(error.status);
    next(error);
  }
};

module.exports = invCont;
