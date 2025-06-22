// Importa el módulo jsonwebtoken para manejar JWT
import jwt from 'jsonwebtoken';

// Middleware para autenticar tokens JWT
export const authenticateToken = (req: any, res: any, next: any) => {
  // Extrae el token desde el header 'Authorization', eliminando el prefijo 'Bearer '
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token, se rechaza el acceso
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado, token requerido' });
  }

  // Verifica el token usando la clave secreta definida en las variables de entorno
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err: any, user: any) => {
    if (err) {
      // Si hay un error (token inválido o expirado), se rechaza el acceso
      return res.status(403).json({ error: 'Token no válido o expirado' });
    }

    // Si el token es válido, se agrega la información del usuario al objeto `req`
    req.user = user;

    // Llama al siguiente middleware o controlador
    next();
  });
};
