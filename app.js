const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");

app.use(bodyParser.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hey there!, this is a server that is used by the senior project");
});

cron.schedule("* * * * * *", () => {
  console.log("I'm running every minute");
});

app.listen(4000);
