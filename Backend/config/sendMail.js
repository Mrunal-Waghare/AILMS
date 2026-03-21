import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to,
    subject: "Reset Your Password",
    html: `
      <p>Your OTP for Password Reset is <b>${otp}</b>.</p>
      <p>It expires in 5 minutes.</p>
    `,
  });
};

export default sendMail;
