import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error("GMAIL_APP_PASSWORD environment variable is not set");
    return res.status(500).json({ 
      error: "Server configuration error"
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "a.hossam.z.a@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const sanitizedName = String(name).slice(0, 100);
  const sanitizedSubject = String(subject).slice(0, 200);
  const sanitizedMessage = String(message).slice(0, 5000);

  const mailOptions = {
    from: `"${sanitizedName}" <a.hossam.z.a@gmail.com>`,
    replyTo: email,
    to: "a.hossam.z.a@gmail.com",
    subject: `[Portfolio Contact] ${sanitizedSubject}`,
    text: `From: ${sanitizedName} <${email}>\n\nMessage:\n${sanitizedMessage}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
}


