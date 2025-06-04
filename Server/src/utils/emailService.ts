import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,   
  },
});

export const sendTransactionEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: "Wamoney", 
    to,
    subject,
    html,
  });
};
