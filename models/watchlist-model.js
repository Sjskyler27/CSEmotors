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

/* ***************************
 *  add an item to the watchlist
 * ************************** */
async function addToWatchlist(inv_id) {
  try {
    const addedItem = await pool.query(
      `INSERT INTO public.watchlist (inv_id) VALUES ($1) RETURNING *`,
      [inv_id]
    );
    return addedItem.rows[0];
  } catch (error) {
    console.error("addToWatchlist error: " + error);
  }
}

/* ***************************
 *  remove an item from the watchlist
 * ************************** */
async function removeFromWatchlist(inv_id) {
  try {
    const removedItem = await pool.query(
      `DELETE FROM public.watchlist WHERE inv_id = $1 RETURNING *`,
      [inv_id]
    );
    return removedItem.rows[0];
  } catch (error) {
    console.error("removeFromWatchlist error: " + error);
  }
}

module.exports = {
  getInventoryFromWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
