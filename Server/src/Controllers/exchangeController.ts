import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../models/Usuario';
import { getExchangeRate } from '../utils/exchangeRates';
import jwt from 'jsonwebtoken';

// Aquí le indicamos que el handler puede recibir next para compatibilidad TS
export const convertBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    let userId: number;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      userId = decoded.id;
    } catch {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }

    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      res.status(400).json({ message: 'Faltan datos' });
      return;
    }
    if (amount <= 0) {
      res.status(400).json({ message: 'El monto debe ser mayor a 0' });
      return;
    }

    const user = await Usuario.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    if (!user.COD[fromCurrency]) {
      res.status(400).json({ message: `Moneda origen inválida: ${fromCurrency}` });
      return;
    }
    if (!user.COD[toCurrency]) {
      res.status(400).json({ message: `Moneda destino inválida: ${toCurrency}` });
      return;
    }

    if (user.COD[fromCurrency] < amount) {
      res.status(400).json({ message: 'Saldo insuficiente' });
      return;
    }

    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * rate;

    const updatedCOD = {
      ...user.COD,
      [fromCurrency]: user.COD[fromCurrency] - amount,
      [toCurrency]: user.COD[toCurrency] + convertedAmount,
    };

    await Usuario.update({ COD: updatedCOD }, { where: { id: userId } });

    res.json({
      message: 'Saldo convertido con éxito',
      convertedAmount,
      balances: updatedCOD,
    });
  } catch (error) {
    console.error("❌ Error en conversión:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
