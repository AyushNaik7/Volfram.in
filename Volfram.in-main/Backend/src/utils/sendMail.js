const nodemailer = require("nodemailer");

const sendEmail = async (email, token, otp) => {
    console.log(`[MAIL] sendEmail reached, pid=${process.pid}, recipient=${email}`);

    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.trim();

    if (!emailUser || !emailPass) {
        console.error("EMAIL CONFIGURATION FAILED!");

        const error = new Error(
            "Email verification is not configured. Set EMAIL_USER and EMAIL_PASS in Backend/.env."
        );

        error.code = "EMAIL_NOT_CONFIGURED";

        throw error;
    }

    try {

        const transporter = nodemailer.createTransport({
             host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4, // Force IPv4
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        // Test Gmail connection
        await transporter.verify();

        console.log("Gmail connection verified successfully!");

        await transporter.sendMail({
            from: `"Volfram.in" <${emailUser}>`,
            to: email,
            subject: "Your Volfram Email Verification OTP",

            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Welcome to Volfram.in!</h2>

                    <p>Your email verification OTP is:</p>

                    <h1 style="font-size: 32px; letter-spacing: 8px;">
                        ${otp}
                    </h1>

                    <p>
                        This OTP expires in 10 minutes.
                    </p>

                    <p>
                        Do not share this OTP with anyone.
                    </p>
                </div>
            `,
        });

        console.log("Email sent successfully to:", email);

    } catch (error) {

        console.error("NODEMAILER ERROR:");
        console.error(error);

        throw error;
    }
};

module.exports = sendEmail;