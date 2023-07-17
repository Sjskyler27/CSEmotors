const watchlistModel = require("../models/watchlist-model");
const utilities = require("../utilities/");

const watchCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
watchCont.buildWatchlistBylocal = async function (req, res, next) {
  try {
    const data = await watchlistModel.getInventoryFromWatchlist();
    let nav = await utilities.getNav();
    const watchlist = await utilities.buildWatchList(data);
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

watchCont.processRemove = async function (req, res, next) {
  let w_id = req.params.id;
  console.log(`removing ${w_id} from watchlist`);
  const data = await watchlistModel.removeFromWatchlist(w_id);
  res.redirect("../");
};

module.exports = watchCont;
