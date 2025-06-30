import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { Transaction } from "../models/Transaction";

export const adminController = {
  // Obtener todos los usuarios con sus transacciones
  getAllUsersWithTransactions: async (req: Request, res: Response) => {
    try {
      // Verificar si el usuario es admin
      const adminUser = await Usuario.findByPk((req as any).user.id);
      if (!adminUser || !adminUser.admin) {
        return res.status(403).json({ error: "Acceso denegado: solo admins" });
      }
      // Obtener todos los usuarios con sus transacciones enviadas y recibidas
      const users = await Usuario.findAll({
        include: [
          {
            model: Transaction,
            as: "sentTransactions",
            include: [
              { model: Usuario, as: "toUser", attributes: ["id", "nombre"] },
            ],
          },
          {
            model: Transaction,
            as: "receivedTransactions",
            include: [
              { model: Usuario, as: "fromUser", attributes: ["id", "nombre"] },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });

      res.json({ users });
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error interno al obtener los usuarios" });
    }
  },

  // Actualizar perfil de cualquier usuario por ID
  /* updateUserById: async (req: Request, res: Response) => {
    try {
      const adminUser = await Usuario.findByPk((req as any).user.id);
      if (!adminUser || !adminUser.admin) {
        return res.status(403).json({ error: "Acceso denegado: solo admins" });
      }

      const { id } = req.params;
      const { imagen, descripcion, nacionalidad, dni, nombre, email } =
        req.body;

      const [updated] = await Usuario.update(
        { imagen, descripcion, nacionalidad, dni, nombre, email },
        { where: { id } }
      );

      if (updated === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });

      const updatedUser = await Usuario.findByPk(id);
      res.json({ message: "Usuario actualizado", user: updatedUser });
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      res.status(500).json({ error: "Error interno al actualizar el usuario" });
    }
  }, */

  // Eliminar usuario por ID
  deleteUserById: async (req: Request, res: Response) => {
    try {
      // Verificar si el usuario es admin
      const adminUser = await Usuario.findByPk((req as any).user.id);
      if (!adminUser || !adminUser.admin) {
        return res.status(403).json({ error: "Acceso denegado: solo admins" });
      }
      // Eliminar usuario por ID
      const { id } = req.params;
      const deleted = await Usuario.destroy({ where: { id } });
      
      if (deleted === 0)
        // Si no se encontró el usuario, retornar error 404
        return res.status(404).json({ error: "Usuario no encontrado" });

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error interno al eliminar el usuario" });
    }
  },
};
