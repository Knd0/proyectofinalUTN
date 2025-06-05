import nodemailer from "nodemailer";

// Configuración del transporter
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Plantilla HTML para correos de transacción
const transactionEmailTemplate = (usuario: string, mensaje: string) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Wamoney</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:auto;background-color:#ffffff;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="background-color:#4CAF50;padding:20px;text-align:center;color:white;">
          <h1 style="margin:0;">Wamoney</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <h2 style="color:#333;">Hola, ${usuario} 👋</h2>
          <p style="color:#555;font-size:16px;line-height:1.5;">
            ${mensaje}
          </p>
          <p style="margin-top:30px;color:#888;font-size:14px;">Si no realizaste esta acción, por favor contactanos.</p>
        </td>
      </tr>
      <tr>
        <td style="background-color:#f1f1f1;padding:15px;text-align:center;color:#888;font-size:12px;">
          © ${new Date().getFullYear()} Wamoney. Todos los derechos reservados.
        </td>
      </tr>
    </table>
  </body>
</html>
`;

// Función para enviar email de transacción
export const sendTransactionEmail = async (to: string, usuario: string, mensaje: string) => {
  const subject = "Transacción realizada con éxito";
  const html = transactionEmailTemplate(usuario, mensaje);

  console.log("📨 Enviando a:", to);
  console.log("📨 Asunto:", subject);

  await transporter.sendMail({
    from: `"Wamoney" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
