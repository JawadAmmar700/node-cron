const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MY_EMAIL}`,
    pass: `${process.env.MY_PASS}`,
  },
  from: `${process.env.MY_EMAIL}`,
  tls: {
    rejectUnauthorized: false,
  },
});

export { transporter };
