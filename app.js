const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");

app.use(bodyParser.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  cron.schedule("*/3 * * * * *", () => {
    console.log("I'm running every minute");
  });
  res.send("Hey there!, this is a server that is used by the senior project");
});

app.listen(4000);
