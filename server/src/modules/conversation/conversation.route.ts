import { Router } from "express";
import { createConversationController } from "./conversation.controller.js";
import { authMiddleware } from "@/common/middleware/auth.middleware.js";

const router = Router();

router.post("/private/:userId", authMiddleware, createConversationController);

export default router;