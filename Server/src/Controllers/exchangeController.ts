import { Request, Response } from "express";
import axios from "axios";
import { Usuario } from "../models/Usuario";

const API_KEY = "cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX";

export const convertCurrency = async (req: Request, res: Response): Promise<void> => {
  const { fromCurrency, toCurrency, amount } = req.body;
  const userId = (req as any).user?.id;

  if (!userId || !fromCurrency || !toCurrency || !amount) {
    res.status(400).json({ message: "Datos incompletos o usuario no autenticado" });
    return;
  }

  try {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (usuario.COD[fromCurrency] < amount) {
      res.status(400).json({ message: `Saldo insuficiente en ${fromCurrency}` });
      return;
    }

    const response = await axios.get(`https://api.currencyapi.com/v3/latest`, {
      params: {
        apikey: API_KEY,
        base_currency: fromCurrency,
        currencies: toCurrency,
      },
    });

    const rate = response.data?.data?.[toCurrency]?.value;

    if (!rate) {
      res.status(500).json({ message: "Error obteniendo tasa de cambio" });
      return;
    }

    const converted = amount * rate;

    usuario.COD[fromCurrency] -= amount;
    usuario.COD[toCurrency] += converted;

    await usuario.save();

    res.status(200).json({
      message: "Conversión exitosa",
      fromCurrency,
      toCurrency,
      amount,
      converted,
      rate,
      COD: usuario.COD,
    });
  } catch (error) {
    console.error("Error al convertir moneda:", error);
    res.status(500).json({ message: "Error del servidor", error });
  }
};
