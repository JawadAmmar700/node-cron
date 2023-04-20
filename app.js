const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const { createCronJob, createCronJobToMarkAsDone } = require("./lib/cron-job");

// require("./monitor");

app.use(bodyParser.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hey there!, this is a server that is used by the senior project");
});

app.post("/", (req, res) => {
  const todo = req.body;
  console.log("todo", todo);
  createCronJob(todo);
  // createCronJobToMarkAsDone(todo);

  res.json({ message: "I'm running every 3 s" });
});

app.listen(4000);
