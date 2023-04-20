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

// Create a cron job that runs every minute
const task = cron.schedule("*/3 * * * * *", () => {
  console.log("I'm running every minute");
});

// Start the cron scheduler
// task.start();

app.listen(4000);
