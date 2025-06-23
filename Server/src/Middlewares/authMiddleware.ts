import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extraer el token del header Authorization

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado, token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token no válido o expirado' });
    }
    req.user = user;  // Agregar información del usuario al request
    next();  // Continuar con el siguiente middleware o controlador
  });
};
