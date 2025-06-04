import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { Usuario } from "../models/Usuario";
import { sequelize } from "../db";
import jwt from "jsonwebtoken";
import { sendTransactionEmail } from "../utils/emailService";

// 🔁 Obtener transacciones del usuario actual
export const getMyTransactions = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  let userId: number;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const sentTransactions = await Transaction.findAll({
      where: { from_user_id: userId },
      include: [
        {
          model: Usuario,
          as: "toUser",
          attributes: ["nombre", "cvu"],
        },
      ],
      order: [["date", "DESC"]],
    });

    const receivedTransactions = await Transaction.findAll({
      where: { to_user_id: userId },
      include: [
        {
          model: Usuario,
          as: "fromUser",
          attributes: ["nombre", "cvu"],
        },
      ],
      order: [["date", "DESC"]],
    });

    const formattedSent = sentTransactions.map(tx => ({
      ...tx.toJSON(),
      type: "sent",
    }));

    const formattedReceived = receivedTransactions.map(tx => ({
      ...tx.toJSON(),
      type: "received",
    }));

    const allTransactions = [...formattedSent, ...formattedReceived].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    res.json(allTransactions);
  } catch (error) {
    console.error("❌ Error al obtener transacciones:", error);
    res.status(500).json({ error: "Error al obtener las transacciones" });
  }
};

// 💸 Crear una nueva transacción
export const createTransaction = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("🔑 Token recibido:", token ? "Sí" : "No");

  if (!token) {
    console.log("❌ Token no proporcionado");
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  let fromUserId: number;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    fromUserId = decoded.id;
    console.log("✅ Token verificado. Usuario ID:", fromUserId);
  } catch (error) {
    console.log("❌ Token inválido");
    return res.status(401).json({ error: "Token inválido" });
  }

  const { toUserCvu, amount, currency } = req.body;
  console.log("🔁 Datos recibidos:", { toUserCvu, amount, currency });

  if (typeof toUserCvu !== "string" || typeof amount !== "number" || typeof currency !== "string") {
    console.log("❌ Campos inválidos:", { toUserCvu, amount, currency });
    return res.status(400).json({ error: "Faltan campos obligatorios o tipo incorrecto" });
  }

  if (amount <= 0) {
    console.log("❌ Monto inválido:", amount);
    return res.status(400).json({ error: "Monto debe ser mayor a cero" });
  }

  try {
    const validCurrencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];
    if (!validCurrencies.includes(currency)) {
      console.log("❌ Moneda no válida:", currency);
      return res.status(400).json({ error: "Moneda no válida" });
    }

    const fromUser = await Usuario.findOne({ where: { id: fromUserId } });
    const toUser = await Usuario.findOne({ where: { cvu: toUserCvu } });

    if (!fromUser) {
      console.log("❌ Usuario remitente no encontrado");
      return res.status(404).json({ error: "Usuario remitente no encontrado" });
    }
    if (!toUser) {
      console.log("❌ Usuario destinatario no encontrado");
      return res.status(404).json({ error: "Usuario destinatario no encontrado" });
    }

    const senderBalance = fromUser.COD[currency] ?? 0;
    const receiverBalance = toUser.COD[currency] ?? 0;

    console.log("📊 Saldo remitente:", senderBalance);
    console.log("📊 Saldo destinatario:", receiverBalance);

    if (senderBalance < amount) {
      console.log("❌ Saldo insuficiente");
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    await sequelize.transaction(async (t) => {
      const updatedSenderCOD = {
        ...fromUser.COD,
        [currency]: senderBalance - amount,
      };

      const updatedReceiverCOD = {
        ...toUser.COD,
        [currency]: receiverBalance + amount,
      };

      console.log("📝 Nuevo balance remitente:", updatedSenderCOD);
      console.log("📝 Nuevo balance destinatario:", updatedReceiverCOD);

      await Usuario.update({ COD: updatedSenderCOD }, { where: { id: fromUserId }, transaction: t });
      await Usuario.update({ COD: updatedReceiverCOD }, { where: { id: toUser.id }, transaction: t });

      await Transaction.create(
        {
          from_user_id: fromUserId,
          to_user_id: toUser.id,
          amount,
          currency,
        },
        { transaction: t }
      );
    });

    // Enviar emails de notificación
    await sendTransactionEmail(
      fromUser.email,
      "Notificación: Transferencia enviada",
      `<p>Hola ${fromUser.nombre},</p><p>Has enviado <strong>${amount} ${currency}</strong> a <strong>${toUser.nombre}</strong> (CVU: ${toUser.cvu}).</p>`
    );

    await sendTransactionEmail(
      toUser.email,
      "Notificación: Transferencia recibida",
      `<p>Hola ${toUser.nombre},</p><p>Has recibido <strong>${amount} ${currency}</strong> de <strong>${fromUser.nombre}</strong> (CVU: ${fromUser.cvu}).</p>`
    );

    console.log("✅ Transacción exitosa");
    return res.status(201).json({ message: "Transacción exitosa" });
  } catch (error) {
    console.error("🔥 Error en createTransaction:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
