const express = require("express");
const utilities = require('./utilities/index')
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRouter")

const port = process.env.PORT;
const host = process.env.HOST;


app.use(require("./routes/static"));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Index route
app.use("/inv", utilities.handleErrors(inventoryRoute))
app.get("/", utilities.handleErrors(baseController.buildHome))

app.use(async (req, res, next) =>{
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
})
