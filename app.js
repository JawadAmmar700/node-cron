const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// const cron = require("node-cron");
const schedule = require("node-schedule");

app.use(bodyParser.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hey there!, this is a server that is used by the senior project");
});

app.post("/todos", (req, res) => {
  // Code to create the post todo goes here...

  // Define a cron job to run at a specific time

  schedule.scheduleJob("* * * * * *", () => {
    console.log("I'm running every minute");
  });
  // Send the response back to the client
  res.json({ message: "Post todo created successfully!" });
});
app.listen(4000);
