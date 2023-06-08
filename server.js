const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");

app.use(require("./routes/static"));

// Set the MIME type for CSS files
app.use("/css", (req, res, next) => {
  res.type("text/css");
  next();
});

const port = process.env.PORT;
const host = process.env.HOST;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.get("/", function (req, res) {
  res.render("index", { title: "home" });
});

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
})