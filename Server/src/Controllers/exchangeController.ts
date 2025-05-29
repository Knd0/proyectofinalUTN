import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import jwt from "jsonwebtoken";

// 🎯 Cambio de moneda dentro del mismo usuario
export const exchangeCurrency = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  let userId: number;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    userId = decoded.id;
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { fromCurrency, toCurrency, amount } = req.body;

  if (
    typeof fromCurrency !== "string" ||
    typeof toCurrency !== "string" ||
    typeof amount !== "number"
  ) {
    res.status(400).json({ error: "Parámetros inválidos" });
    return;
  }

  if (fromCurrency === toCurrency) {
    res.status(400).json({ error: "Las monedas deben ser diferentes" });
    return;
  }

  if (amount <= 0) {
    res.status(400).json({ error: "Monto inválido" });
    return;
  }

  const validCurrencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];
  if (!validCurrencies.includes(fromCurrency) || !validCurrencies.includes(toCurrency)) {
    res.status(400).json({ error: "Moneda no válida" });
    return;
  }

  try {
    const user = await Usuario.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const saldoOrigen = user.COD[fromCurrency] ?? 0;
    const saldoDestino = user.COD[toCurrency] ?? 0;

    if (saldoOrigen < amount) {
      res.status(400).json({ error: "Saldo insuficiente en " + fromCurrency });
      return;
    }

    const updatedCOD = {
      ...user.COD,
      [fromCurrency]: saldoOrigen - amount,
      [toCurrency]: saldoDestino + amount,
    };

    await Usuario.update({ COD: updatedCOD }, { where: { id: userId } });

    res.status(200).json({
      message: "Cambio realizado con éxito",
      nuevoSaldo: updatedCOD,
    });
  } catch (error) {
    console.error("🔥 Error en exchangeCurrency:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
