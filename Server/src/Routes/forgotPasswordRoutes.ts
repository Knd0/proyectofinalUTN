import express from "express";
import { forgotPassword, resetPassword } from "../Controllers/forgotPasswordController";

const router = express.Router();

router.post('/forgot-password',  async (req, res) => {
  await forgotPassword(req, res);
});
router.post('/reset-password/:token',  async (req, res) => {
  await resetPassword(req, res);
});


export default router;
