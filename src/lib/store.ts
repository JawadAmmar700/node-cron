import { type ScheduledTask } from "node-cron";

const job_crons = new Map();

const add_job_crons = (
  id: string,
  scheduledJob: ScheduledTask,
  jobToMarkAsDone: ScheduledTask
) => {
  job_crons.set(id, {
    scheduledJob,
    jobToMarkAsDone,
  });
};

const remove_job_crons = (id: string) => {
  job_crons.delete(id);
};

const get_job_crons = (id: string) => {
  return job_crons.get(id);
};

export { add_job_crons, remove_job_crons, get_job_crons };
