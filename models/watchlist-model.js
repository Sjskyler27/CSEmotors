const pool = require("../database/");

/* ***************************
 *  Get all inventory items from the watchlist
 * ************************** */
async function getInventoryFromWatchlist() {
  try {
    const data = await pool.query(
      `SELECT i.*
        FROM public.inventory AS i
        JOIN public.watchlist AS w
        ON i.inv_id = w.inv_id`
    );
    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error("getInventoryFromWatchlist error: " + error);
  }
}

module.exports = {
  getInventoryFromWatchlist,
};
