const { BrevoClient } = require("@getbrevo/brevo");

const sendEmail = async (email, token, otp) => {
    console.log(`[MAIL] sendEmail reached, pid=${process.pid}, recipient=${email}`);

    const apiKey = process.env.BREVO_API_KEY?.trim();
    const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
    const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Volfram.in";

    if (!apiKey || !senderEmail) {
        console.error("EMAIL CONFIGURATION FAILED!");

        const error = new Error(
            "Email verification is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL in Backend/.env."
        );

        error.code = "EMAIL_NOT_CONFIGURED";

        throw error;
    }

    try {
        const brevo = new BrevoClient({ apiKey });

        await brevo.transactionalEmails.sendTransacEmail({
            sender: { name: senderName, email: senderEmail },
            to: [{ email }],
            subject: "Your Volfram Email Verification OTP",
            htmlContent: `
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
            `
        });

        console.log("Email sent successfully to:", email);

    } catch (error) {

        console.error("BREVO ERROR:");
        console.error(error);

        throw error;
    }
};

module.exports = sendEmail;