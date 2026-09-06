const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    const error = new Error(
      "Email verification is not configured. Set EMAIL_USER and EMAIL_PASS in Backend/.env. For Gmail, EMAIL_PASS must be an app password."
    );
    error.code = "EMAIL_NOT_CONFIGURED";
    throw error;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const API_URL = process.env.BACKEND_URL || 'http://localhost:7000';
  const verifyLink = `${API_URL}/api/verify/${token}`;

  await transporter.sendMail({
    from: emailUser,
    to: email,
    subject: "Verify your email",
    html: `
    <h1>Welcome to Volfram.in!</h1>
      <h2>Email Verification</h2>
      <p>Click below to verify:</p>
      <a href="${verifyLink}">Verify Email</a>
    `
  });
};

module.exports = sendEmail;