// import express, { Request, Response } from 'express';
// import { sequelize } from '../db';
// import { Usuario } from '../models/Usuario';
// import { Currency } from '../models/Currency';
// import { History } from '../models/History';

// const app = express();
// app.use(express.json());


// app.get('/usuarios', async (_req: Request, res: Response) => {
//   const usuarios = await Usuario.findAll();
//   res.json(usuarios);
// });

// app.post('/usuarios', async (req: Request, res: Response) => {
//   try {
//     const usuario = await Usuario.create(req.body);
//     res.status(201).json(usuario);
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// });

// app.get('/usuarios/:id', async (req: Request, res: Response) => {
//   const usuario = await Usuario.findByPk(req.params.id);
//   if (usuario) {
//     const currency = await Currency.findByPk(usuario.id);
//     const history = await History.findByPk(usuario.id);
//     res.json({
//       ...usuario.toJSON(),
//       currency: currency ? currency.toJSON() : null,
//       history: history ? history.toJSON() : null
//     });
//   } else {
//     res.status(404).json({ error: 'Usuario no encontrado' });
//   }
// });

// app.put('/usuarios/:id', async (req: Request, res: Response) => {
//   const [updated] = await Usuario.update(req.body, { where: { id: req.params.id } });
//   if (updated) {
//     const usuario = await Usuario.findByPk(req.params.id);
//     res.json(usuario);
//   } else {
//     res.status(404).json({ error: 'Usuario no encontrado' });
//   }
// });

// app.delete('/usuarios/:id', async (req: Request, res: Response) => {
//   const deleted = await Usuario.destroy({ where: { id: req.params.id } });
//   if (deleted) {
//     res.json({ message: 'Usuario eliminado' });
//   } else {
//     res.status(404).json({ error: 'Usuario no encontrado' });
//   }
// });

// export default app;
