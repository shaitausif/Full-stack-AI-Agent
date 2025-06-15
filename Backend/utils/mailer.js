// This is a utility file where i am going to write the code for sending the mails

import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  try {
    // For docs : https://nodemailer.com/
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
    //   make sure to remove this sucure : false before pushing the app on production
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    // Wrap in an async IIFE so we can use await.
    (async () => {
  const info = await transporter.sendMail({
    from: 'Inngest TMS',
    to,
    subject,
    text, // plain‑text body
    // html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info);
  return info
})();

  } catch (error) {
    console.log("Mail Error : ",error.message)
    throw error
  }
};
