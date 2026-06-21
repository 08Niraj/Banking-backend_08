const nodemailer = require("nodemailer");

// Debugging
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);

// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Welcome Email
const sendEmail = async ({ name, email }) => {
    try {
        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome!",
            html: `
                <h2>Hello ${name},</h2>
                <p>Thank you for registering with us.</p>
            `,
        });

        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

// Transaction Email
const sendTransactionEmail = async (
    userEmail,
    name,
    account,
    toAccount,
    amount
) => {
    try {
        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Transaction Successful",
            html: `
                <h2>Hello ${name},</h2>

                <p>Your transaction has been completed successfully.</p>

                <h3>Transaction Details:</h3>
                <ul>
                    <li><strong>From Account:</strong> ${account}</li>
                    <li><strong>To Account:</strong> ${toAccount}</li>
                    <li><strong>Amount:</strong> ₹${amount}</li>
                </ul>

                <p>Thank you for using our banking service.</p>
            `,
        });

        console.log("Transaction email sent successfully");
    } catch (error) {
        console.error("Transaction email sending failed:", error);
    }
};


const sendFailedTransactionEmail = async (
    userEmail,
    name,
    account,
    toAccount,
    amount,
    
) => {
    try {
        await transporter.sendMail({
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: "Transaction Failed",
            html: `
                <h2>Hello ${name},</h2>

                <p style="color:red;">
                    Your transaction could not be completed.
                </p>

                <h3>Transaction Details:</h3>
                <ul>
                    <li><strong>From Account:</strong> ${account}</li>
                    <li><strong>To Account:</strong> ${toAccount}</li>
                    <li><strong>Amount:</strong> ₹${amount}</li>
                    
                </ul>

                <p>
                    Please check your account details and try again.
                </p>
            `,
        });

        console.log("Failed transaction email sent successfully");
    } catch (error) {
        console.error(
            "Failed transaction email sending failed:",
            error
        );
    }
};
module.exports = {
    sendEmail,
    sendTransactionEmail,
    sendFailedTransactionEmail
};