const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { createCronJob, createCronJobToMarkAsDone } = require("./lib/cron-job");

app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_APP, optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hey there!, this is a server that is used by the senior project");
});

app.post("/", (req, res) => {
  const { todo } = req.body;
  createCronJob(todo);
  createCronJobToMarkAsDone(todo);
  res.json({ message: "Cron is created succussfully" });
});

app.listen(5000);
