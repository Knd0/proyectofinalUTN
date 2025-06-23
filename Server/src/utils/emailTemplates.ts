// Función que genera una plantilla HTML para el correo de confirmación de cuenta
export const sendConfirmationEmailTemplate = (nombre: string, link: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- Metadatos básicos y estilos internos -->
  <meta charset="UTF-8">
  <title>Confirmación de Cuenta</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content h2 {
      color: #111827;
    }
    .content p {
      color: #374151;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #10b981;
      color: #ffffff;
      font-weight: bold;
      border-radius: 8px;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #059669;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <!-- Contenido principal del email -->
  <div class="container">
    <div class="header">
      <h1>Bienvenido a Wamoney</h1>
    </div>
    <div class="content">
      <h2>Hola, ${nombre} 👋</h2>
      <p>Gracias por registrarte. Por favor, confirmá tu cuenta haciendo clic en el botón de abajo:</p>
      <a href="${link}" class="button">Confirmar cuenta</a>
      <p class="footer">Si no te registraste, podés ignorar este correo.</p>
    </div>
  </div>
</body>
</html>
`;

// Función que genera una plantilla HTML para el correo de restablecimiento de contraseña
export const sendResetPasswordEmailTemplate = (nombre: string, link: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Restablecer Contraseña</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content h2 {
      color: #111827;
    }
    .content p {
      color: #374151;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: #ffffff;
      font-weight: bold;
      border-radius: 8px;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #2563eb;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <!-- Contenido del mensaje para restablecer la contraseña -->
  <div class="container">
    <div class="header">
      <h1>Restablecer Contraseña</h1>
    </div>
    <div class="content">
      <h2>Hola, ${nombre} 👋</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el botón para crear una nueva contraseña:</p>
      <a href="${link}" class="button" target="_blank" rel="noopener noreferrer">Restablecer contraseña</a>
      <p class="footer">Si no solicitaste este cambio, podés ignorar este correo.</p>
    </div>
  </div>
</body>
</html>
`;
