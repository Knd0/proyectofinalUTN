import { Router } from "express";
import { sendConfirmationEmail, confirmAccount } from "../Controllers/confirmedController";
import { authenticateToken } from "../Middlewares/authMiddleware";

const router = Router();

router.post("/send-confirmation", authenticateToken, async (req, res) => {
  await sendConfirmationEmail(req, res);
});
router.get("/confirm/:token", authenticateToken, async (req, res) => {
  await confirmAccount(req, res);
});

export default router;