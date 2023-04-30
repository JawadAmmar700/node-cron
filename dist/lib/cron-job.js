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
exports.createCronJobToMarkAsDone = exports.createCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = require("./nodemailer");
const client_1 = require("@prisma/client");
const store_1 = require("./store");
const client = new client_1.PrismaClient();
const createScheduleExpression = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
    return cronExpression;
};
const UnixToTimeString = (time, offset) => {
    const unixTimestamp = time * 1000;
    const date = new Date(unixTimestamp - offset);
    const timeString = date.toLocaleTimeString("en-US", {
        timeZone: "Europe/Istanbul",
        hour12: false,
    });
    return timeString;
};
const dateFromString = (dateString, timeString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // add zero-padding to month
    const day = date.getDate().toString().padStart(2, "0"); // add zero-padding to day
    const formattedDate = `${year}-${month}-${day}`;
    const scheduledTime = new Date(`${formattedDate}T${timeString}`);
    return scheduledTime;
};
const createSchedule = (dateString, time, offset = 0) => {
    const timeToTimeString = UnixToTimeString(time, offset);
    const scheduledTime = dateFromString(dateString, timeToTimeString);
    const cronSchedule = createScheduleExpression(scheduledTime);
    return cronSchedule;
};
const createCronJob = (todo) => {
    const cronSchedule = createSchedule(todo.date, todo.unix, 600000);
    console.log(cronSchedule);
    const scheduledJob = node_cron_1.default.schedule(cronSchedule, () => __awaiter(void 0, void 0, void 0, function* () {
        yield client.reminder.update({
            where: {
                id: todo.id,
            },
            data: {
                notificationSent: true,
            },
        });
        const mailOptions = {
            from: `${process.env.MY_EMAIL}`,
            to: todo.user.email,
            subject: `Reminder: [${todo.title}]`,
            text: `Message: \n Hello, \n\n This is a friendly reminder that you have a task to complete: [${todo.title}]. Please complete this task as soon as possible. \n\n Thank you, \n\n meetly-omega.vercel.app`,
        };
        yield nodemailer_1.transporter.sendMail(mailOptions);
    }), {
        timezone: "Europe/Istanbul",
    });
    return scheduledJob;
};
exports.createCronJob = createCronJob;
const createCronJobToMarkAsDone = (todo) => {
    const cronSchedule = createSchedule(todo.date, todo.unix);
    console.log(cronSchedule);
    const jobToMarkAsDone = node_cron_1.default.schedule(cronSchedule, () => __awaiter(void 0, void 0, void 0, function* () {
        (0, store_1.remove_job_crons)(todo.id);
        yield client.reminder.update({
            where: {
                id: todo.id,
            },
            data: {
                isDone: true,
            },
        });
    }), {
        timezone: "Europe/Istanbul",
    });
    return jobToMarkAsDone;
};
exports.createCronJobToMarkAsDone = createCronJobToMarkAsDone;
