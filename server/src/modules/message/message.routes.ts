import { Router } from "express";

import { createMessageController, getMessagesController } from "./message.controller.js";
import { authMiddleware } from "@/common/middleware/auth.middleware.js";


const router = Router();


router.get("/:conversationId", authMiddleware, getMessagesController);
router.post("/:conversationId", authMiddleware, createMessageController);

export default router;