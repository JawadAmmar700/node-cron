"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cron_job_1 = require("./lib/cron-job");
const store_1 = require("./lib/store");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({ origin: process.env.CLIENT_APP, optionsSuccessStatus: 200 }));
app.get("/", (_, res) => {
    res.send("Hey there!, this is a reminder schedule task for meetly-omega.vercel.app");
});
app.post("/", (req, res) => {
    const { todo } = req.body;
    const scheduledJob = (0, cron_job_1.createCronJob)(todo);
    const jobToMarkAsDone = (0, cron_job_1.createCronJobToMarkAsDone)(todo);
    (0, store_1.add_job_crons)(todo.id, scheduledJob, jobToMarkAsDone);
    res.json({ message: "Cron is created succussfully" });
});
app.post("/reminder-update", (req, res) => {
    const { todo } = req.body;
    const job = (0, store_1.get_job_crons)(todo.id);
    job.scheduledJob.stop();
    job.jobToMarkAsDone.stop();
    (0, store_1.remove_job_crons)(todo.id);
    const scheduledJob = (0, cron_job_1.createCronJob)(todo);
    const jobToMarkAsDone = (0, cron_job_1.createCronJobToMarkAsDone)(todo);
    (0, store_1.add_job_crons)(todo.id, scheduledJob, jobToMarkAsDone);
    res.json({ message: "Cron is updated succussfully" });
});
app.listen(5000);
