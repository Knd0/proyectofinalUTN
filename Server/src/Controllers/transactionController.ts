import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { Transaction } from "../models/Transaction";
import { sequelize } from '../db';

export const createTransaction = async (req: Request, res: Response) => {
  const fromUserId = (req.user as any).id;
  const { toUserCvu, amount, currency } = req.body;

  if (!toUserCvu || !amount || !currency) {
    res.status(400).json({ error: "Faltan datos requeridos" });
    return;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: "Monto inválido" });
    return;
  }

  try {
    const fromUser = await Usuario.findByPk(fromUserId);
    const toUser = await Usuario.findOne({ where: { cvu: toUserCvu } });

    if (!fromUser || !toUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    if (!fromUser.COD[currency] || fromUser.COD[currency] < amount) {
      res.status(400).json({ error: "Saldo insuficiente" });
      return;
    }

    await sequelize.transaction(async (t) => {
      fromUser.COD[currency] -= amount;
      toUser.COD[currency] += amount;

      await fromUser.save({ transaction: t });
      await toUser.save({ transaction: t });

      await Transaction.create({
        from_user_id: fromUserId,
        to_user_id: toUser.id,
        amount,
        currency,
      }, { transaction: t });
    });

    res.status(201).json({ message: "Transacción exitosa" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
    return;
  }
};
