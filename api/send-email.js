import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, subject, message } = req.body;

  // Check if environment variable is set
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error("GMAIL_APP_PASSWORD environment variable is not set");
    return res.status(500).json({ 
      error: "Server configuration error", 
      details: "Email service not properly configured" 
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdelrahmanhossam2222@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${name}" <abdelrahmanhossam2222@gmail.com>`,
    replyTo: email,
    to: "abdelrahmanhossam2222@gmail.com",
    subject,
    text: `From: ${name} <${email}>\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error.response || error);
    return res.status(500).json({ error: "Failed to send email", details: error.message || error.toString() });
  }
}

