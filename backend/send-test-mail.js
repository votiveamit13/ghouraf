import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),  // 587
  secure: false,                        // must be false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_USER, // send to yourself for test
    subject: "SMTP Test",
    text: "Hello, this is a test email!",
  });
  console.log("✅ Email sent:", info.messageId);
} catch (err) {
  console.error("❌ Email failed:", err);
}
