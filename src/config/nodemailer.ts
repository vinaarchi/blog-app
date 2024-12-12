import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_APP_PASSWORD,
    // user: "xiuupinn@gmail.com",
    // pass: "xdcoqvsgeupbwtur",
  },
});