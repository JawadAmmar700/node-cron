"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const nodemailer_1 = require("./lib/nodemailer");
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
app.put("/reminder-update", (req, res) => {
    const { todo } = req.body;
    const job = (0, store_1.get_job_crons)(todo.id);
    if (!job)
        return res.json({ message: "There is no cron job" });
    job.scheduledJob.stop();
    job.jobToMarkAsDone.stop();
    (0, store_1.remove_job_crons)(todo.id);
    const scheduledJob = (0, cron_job_1.createCronJob)(todo);
    const jobToMarkAsDone = (0, cron_job_1.createCronJobToMarkAsDone)(todo);
    (0, store_1.add_job_crons)(todo.id, scheduledJob, jobToMarkAsDone);
    res.json({ message: "Cron is updated succussfully" });
});
app.delete("/reminder-deleted", (req, res) => {
    const { todoId } = req.body;
    // const { todoId } = req.query as { todoId: string };
    const job = (0, store_1.get_job_crons)(todoId);
    if (!job)
        return res.json({ message: "There is no cron job" });
    job.scheduledJob.stop();
    job.jobToMarkAsDone.stop();
    (0, store_1.remove_job_crons)(todoId);
    res.json({ message: "Cron is deleted succussfully" });
});
app.post("/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `${process.env.MY_EMAIL}`,
        to: req.body.email,
        subject: `Reminder`,
        text: "",
        html: `Message: \n Hello, \n\n This is a friendly reminder that you have a task to complete: [test]. Please complete this task as soon as possible. \n\n Thank you, \n\n meetly-omega.vercel.app`,
    };
    yield nodemailer_1.transporter.sendMail(mailOptions);
    res.json({ message: "sent" });
}));
app.listen(5000);
//# sourceMappingURL=index.js.map