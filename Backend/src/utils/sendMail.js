const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verifyLink = `http://localhost:7000/api/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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