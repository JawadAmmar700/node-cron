import cron from "node-cron";
import { PrismaClient, type Reminder } from "@prisma/client";
import { remove_job_crons } from "./store";
const client = new PrismaClient();

const createScheduleExpression = (date: Date) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
  return cronExpression;
};

const UnixToTimeString = (time: number, offset: number) => {
  const unixTimestamp = time * 1000;
  const date = new Date(unixTimestamp - offset);
  const timeString = date.toLocaleTimeString("en-US", {
    timeZone: "Europe/Istanbul",
    hour12: false,
  });
  return timeString;
};

const dateFromString = (dateString: string, timeString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // add zero-padding to month
  const day = date.getDate().toString().padStart(2, "0"); // add zero-padding to day
  const formattedDate = `${year}-${month}-${day}`;
  const scheduledTime = new Date(`${formattedDate}T${timeString}`);
  return scheduledTime;
};

const createSchedule = (dateString: string, time: number, offset = 0) => {
  const timeToTimeString = UnixToTimeString(time, offset);
  const scheduledTime = dateFromString(dateString, timeToTimeString);
  const cronSchedule = createScheduleExpression(scheduledTime);
  return cronSchedule;
};

type TODO = Reminder & { user: { email: string; name: string } };

const createCronJob = (todo: TODO) => {
  const cronSchedule = createSchedule(todo.date, todo.unix, 600000);

  const scheduledJob = cron.schedule(
    cronSchedule,
    async () => {
      await client.reminder.update({
        where: {
          id: todo.id,
        },
        data: {
          notificationSent: true,
        },
      });
      try {
        await fetch(process.env.SENIOR_NODEMAILER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to: todo.user.email, title: todo.title }),
        });
      } catch (error) {
        console.log(error);
      }
    },
    {
      timezone: "Europe/Istanbul",
    }
  );
  return scheduledJob;
};

const createCronJobToMarkAsDone = (todo: Reminder) => {
  const cronSchedule = createSchedule(todo.date, todo.unix);

  const jobToMarkAsDone = cron.schedule(
    cronSchedule,
    async () => {
      remove_job_crons(todo.id);
      await client.reminder.update({
        where: {
          id: todo.id,
        },
        data: {
          isDone: true,
        },
      });
    },
    {
      timezone: "Europe/Istanbul",
    }
  );
  return jobToMarkAsDone;
};

export { createCronJob, createCronJobToMarkAsDone };
