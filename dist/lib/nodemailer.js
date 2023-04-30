"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.MY_EMAIL}`,
        pass: `${process.env.MY_PASS}`,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
exports.transporter = transporter;
