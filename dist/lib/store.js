"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_job_crons = exports.remove_job_crons = exports.add_job_crons = void 0;
const job_crons = new Map();
const add_job_crons = (id, scheduledJob, jobToMarkAsDone) => {
    job_crons.set(id, {
        scheduledJob,
        jobToMarkAsDone,
    });
};
exports.add_job_crons = add_job_crons;
const remove_job_crons = (id) => {
    job_crons.delete(id);
};
exports.remove_job_crons = remove_job_crons;
const get_job_crons = (id) => {
    return job_crons.get(id);
};
exports.get_job_crons = get_job_crons;
