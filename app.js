const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { createCronJob, createCronJobToMarkAsDone } = require("./lib/cron-job");
const {
  add_job_crons,
  get_job_crons,
  remove_job_crons,
} = require("./lib/store");

app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_APP, optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hey there!, this is a server that is used by the senior project");
});

app.post("/", (req, res) => {
  const { todo } = req.body;
  const scheduledJob = createCronJob(todo);
  const jobToMarkAsDone = createCronJobToMarkAsDone(todo);
  add_job_crons(todo.id, scheduledJob, jobToMarkAsDone);
  console.log("Cron is created succussfully", get_job_crons(todo.id));
  res.json({ message: "Cron is created succussfully" });
});

app.post("/reminder-update", (req, res) => {
  const { todo } = req.body;
  console.log("Cron is updated succussfully", get_job_crons(todo.id));
  const job = get_job_crons(todo.id);
  job.scheduledJob.stop();
  job.jobToMarkAsDone.stop();
  remove_job_crons(todo.id);

  const scheduledJob = createCronJob(todo);
  const jobToMarkAsDone = createCronJobToMarkAsDone(todo);

  add_job_crons(todo.id, scheduledJob, jobToMarkAsDone);

  res.json({ message: "Cron is updated succussfully" });
});

app.listen(5000);
