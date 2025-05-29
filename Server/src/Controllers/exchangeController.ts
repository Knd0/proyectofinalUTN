import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import jwt from "jsonwebtoken";
import axios from "axios";

export const exchangeCurrency = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  let userId: number;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    userId = decoded.id;
  } catch {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { fromCurrency, toCurrency, amount } = req.body;

  if (
    typeof fromCurrency !== "string" ||
    typeof toCurrency !== "string" ||
    typeof amount !== "number"
  ) {
    res.status(400).json({ error: "Datos inválidos" });
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
    const user = await Usuario.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const cod = user.COD || {};

    const saldoOrigen = cod[fromCurrency] ?? 0;
    const saldoDestino = cod[toCurrency] ?? 0;

    if (saldoOrigen < amount) {
      res.status(400).json({ error: `Saldo insuficiente en ${fromCurrency}` });
      return;
    }

    // Obtener tasa de cambio real
    const apiKey = process.env.CURRENCY_API_KEY || "cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX";
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;

    const response = await axios.get(url);
    const rate = response.data?.data?.[toCurrency]?.value;

    if (!rate || typeof rate !== "number") {
      res.status(500).json({ error: "No se pudo obtener la tasa de cambio" });
      return;
    }

    const convertedAmount = parseFloat((amount * rate).toFixed(6));

    // Restar y sumar saldo con la tasa aplicada
    cod[fromCurrency] = parseFloat((saldoOrigen - amount).toFixed(6));
    cod[toCurrency] = parseFloat((saldoDestino + convertedAmount).toFixed(6));

    // Actualizar en la DB
    await Usuario.update({ COD: cod }, { where: { id: userId } });

    res.status(200).json({
      message: "Conversión realizada con éxito",
      converted: convertedAmount,
      nuevoSaldo: cod,
    });
  } catch (error) {
    console.error("Error en exchangeCurrency:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
