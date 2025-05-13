// src/types/CustomRequest.ts
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Definir CustomRequest que extienda Request de Express
export interface CustomRequest extends Request {
  user?: JwtPayload & { id: string };  // Aseguramos que user tenga un id como string
}
