import { Router } from "express";
import { sendConfirmationEmail, confirmAccount } from "../Controllers/confirmedController";

const router = Router();

// Sin middleware
router.post("/send-confirmation", sendConfirmationEmail);
router.get("/confirm/:token", confirmAccount);

export default router;
