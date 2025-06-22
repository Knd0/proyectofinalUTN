// Importamos nodemailer para poder enviar correos electrónicos
import nodemailer from "nodemailer";

// Configuración del transporter de nodemailer para usar Gmail como servicio de envío
export const transporter = nodemailer.createTransport({
  service: "gmail", // Usamos el servicio Gmail
  auth: {
    user: process.env.MAIL_USER, // Usuario del correo (definido en variables de entorno)
    pass: process.env.MAIL_PASS, // Contraseña o token del correo
  },
});

// Plantilla HTML para correos relacionados con transacciones (envíos, recepción, etc.)
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
            ${mensaje} <!-- Aquí se inserta el mensaje dinámico de la transacción -->
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

// Función asíncrona para enviar el correo electrónico de transacción
export const sendTransactionEmail = async (to: string, usuario: string, mensaje: string) => {
  const subject = "Transacción realizada con éxito"; // Asunto del correo
  const html = transactionEmailTemplate(usuario, mensaje); // HTML generado con la plantilla

  // Logging básico para monitorear envío
  console.log("📨 Enviando a:", to);
  console.log("📨 Asunto:", subject);

  // Enviamos el correo usando el transporter previamente configurado
  await transporter.sendMail({
    from: `"Wamoney" <${process.env.MAIL_USER}>`, // Remitente
    to,                                          // Destinatario
    subject,                                     // Asunto
    html,                                        // Cuerpo del mensaje en formato HTML
  });
};
