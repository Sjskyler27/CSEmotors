const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController")

const port = process.env.PORT;
const host = process.env.HOST;


app.use(require("./routes/static"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.get("/", baseController.buildHome);

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
})
