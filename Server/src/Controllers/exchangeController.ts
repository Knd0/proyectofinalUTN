import { Request, Response, NextFunction } from "express";
import { Usuario } from "../models/Usuario";
import jwt from "jsonwebtoken";
import axios from "axios";

export const exchangeCurrency = async (req: Request, res: Response, next: NextFunction) => {
  const { fromCurrency, toCurrency, amount } = req.body;

  console.log("🔁 Datos recibidos:", { fromCurrency, toCurrency, amount });

  const token = req.headers.authorization?.split(" ")[1];
  console.log("🔑 Token recibido:", token ? "Sí" : "No");

  if (
    typeof fromCurrency !== "string" ||
    typeof toCurrency !== "string" ||
    typeof amount !== "number"
  ) {
    console.log("❌ Campos inválidos");
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const validCurrencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];
  if (!validCurrencies.includes(fromCurrency) || !validCurrencies.includes(toCurrency)) {
    console.log("❌ Moneda no válida:", { fromCurrency, toCurrency });
    return res.status(400).json({ error: "Moneda no válida" });
  }

  if (fromCurrency === toCurrency) {
    console.log("⚠️ Las monedas deben ser diferentes");
    return res.status(400).json({ error: "Las monedas deben ser diferentes" });
  }

  if (amount <= 0) {
    console.log("⚠️ El monto debe ser mayor que cero");
    return res.status(400).json({ error: "Monto inválido" });
  }

  try {
    if (!token) {
      console.log("❌ Token no proporcionado");
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const userId = decoded.id;
    console.log("✅ Token verificado. Usuario ID:", userId);

    const user = await Usuario.findOne({ where: { id: userId } });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const currentCOD = user.COD || {};
    console.log("📊 Balance actual:", currentCOD);

    const saldoOrigen = currentCOD[fromCurrency] ?? 0;
    const saldoDestino = currentCOD[toCurrency] ?? 0;

    if (saldoOrigen < amount) {
      console.log(`❌ Saldo insuficiente en ${fromCurrency}: disponible ${saldoOrigen}`);
      return res.status(400).json({ error: `Saldo insuficiente en ${fromCurrency}` });
    }

    // Obtener tasa de cambio
    const apiKey = process.env.CURRENCY_API_KEY || "cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX";
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${fromCurrency}&currencies=${toCurrency}`;
    
    const exchangeResponse = await axios.get(url);
    const rate = exchangeResponse.data?.data?.[toCurrency]?.value;

    if (!rate || typeof rate !== "number") {
      console.log("❌ Tasa de cambio inválida:", rate);
      return res.status(500).json({ error: "No se pudo obtener la tasa de cambio" });
    }

    const converted = parseFloat((amount * rate).toFixed(6));

    // Calcular nuevo balance
    const updatedCOD = {
      ...currentCOD,
      [fromCurrency]: parseFloat((saldoOrigen - amount).toFixed(6)),
      [toCurrency]: parseFloat((saldoDestino + converted).toFixed(6)),
    };

    console.log("🧮 Nuevo balance tras conversión:", updatedCOD);

    // Actualizar usuario
    await Usuario.update({ COD: updatedCOD }, { where: { id: userId } });

    console.log("✅ Conversión realizada con éxito");

    return res.status(200).json({
      message: `Conversión realizada: ${amount} ${fromCurrency} → ${converted} ${toCurrency}`,
      converted,
      balance: updatedCOD,
    });
  } catch (error) {
    console.error("🔥 Error en exchangeCurrency:", error);
    return res.status(500).json({ error: "Error en la conversión de divisas" });
  }
};
