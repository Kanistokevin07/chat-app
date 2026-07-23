import { Router } from "express";
import { createConversationController, getConversationsController } from "./conversation.controller.js";
import { authMiddleware } from "@/common/middleware/auth.middleware.js";

const router = Router();

router.post("/private/:userId", authMiddleware, createConversationController);
router.get("/", authMiddleware, getConversationsController);

export default router;