const invModel = require("../models/inventory-model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class = "itemul">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details" class="inv-link">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span class='inv-price'>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// make individual car views
Util.buildVehicleInfo = async function (data) {
  let infoPage = '<div id="info-wrapper" class="info-wrapper">';
  if (data.length > 0) {
    infoPage +=
      '<img class="car-image" src="' +
      data[0].inv_image +
      '" alt="Image of ' +
      data[0].inv_make +
      " " +
      data[0].inv_model +
      '"/>';

    infoPage += '<div class="details">';
    infoPage +=
      "<h2>" + data[0].inv_make + " " + data[0].inv_model + " Details:</h2>";
    infoPage += "<ul>";
    infoPage +=
      '<li> <span class="boldme">Price:</span> $' +
      new Intl.NumberFormat("en-US").format(data[0].inv_price) +
      "</li>";
    infoPage +=
      '<li> <span class="boldme">Description:</span> ' +
      data[0].inv_description +
      "</li>";
    infoPage +=
      '<li> <span class="boldme">Miles:</span> ' +
      new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
      "</li>";
    infoPage +=
      '<li> <span class="boldme">Color:</span> ' + data[0].inv_color + "</li>";

    infoPage += "</ul></div>";
  } else {
    infoPage +=
      '<p class="notice">Sorry, no matching vehicle could be found.</p>';
  }
  infoPage += "</div>";
  return infoPage;
};

// make watchlist view
Util.buildWatchList = async function (data) {
  let watchlist;
  if (data.length > 0) {
    watchlist = '<ul id="watchlist-display" class="inv-display">';
    data.forEach((vehicle) => {
      watchlist += "<li>";
      watchlist +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      watchlist += '<div class="namePrice">';
      watchlist += "<hr />";
      watchlist += "<h2>";
      watchlist +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details" class="inv-link">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      watchlist += "</h2>";
      watchlist +=
        "<span class='inv-price'>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      watchlist += "<br><button class=remove-button>Remove</button>";
      watchlist += "</div>";
      watchlist += "</li>";
    });
    watchlist += "</ul>";
  } else {
    watchlist += '<p class="notice">Add vehicles to your watchlist!</p>';
  }
  return watchlist;
};

Util.buildClassDropdown = async function (classification_id) {
  let classes = await invModel.getClassifications();

  let select =
    '<label for="classification_id">Classification:</label><select id="classification_id" class="class-dropdown p-font" name="classification_id" required><option value="" disabled selected>Select classification</option>';

  for (var c = 0; c < classes.rowCount; c++) {
    const selected =
      classification_id &&
      classes.rows[c].classification_id === classification_id
        ? "selected"
        : "";
    select += `<option value="${classes.rows[c].classification_id}" ${selected}>${classes.rows[c].classification_name}</option>`;
  }
  select += "</select>";
  return select;
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

//logout
Util.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
};

module.exports = Util;
