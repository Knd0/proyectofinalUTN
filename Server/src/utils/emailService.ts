import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,   
  },
});

export const sendTransactionEmail = async (to: string, subject: string, html: string) => {
    console.log("📨 Enviando a:", to);
    console.log("📨 Asunto:", subject);
    await transporter.sendMail({
    from: "Wamoney", 
    to,
    subject,
    html,
  });
};
