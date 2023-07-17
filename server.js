const express = require("express");
const utilities = require("./utilities/index");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRouter");
const accountRoute = require("./routes/accountRouter");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const pool = require("./database/");
const port = process.env.PORT;
const host = process.env.HOST;
const cookieParser = require("cookie-parser");

app.use(require("./routes/static"));

//set up session
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(utilities.checkJWTToken);
app.use("/account", utilities.handleErrors(accountRoute));
app.use("/inv", utilities.handleErrors(inventoryRoute));
app.get("/", utilities.handleErrors(baseController.buildHome));

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
