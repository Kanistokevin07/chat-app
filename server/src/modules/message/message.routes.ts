import { Router } from "express";

import { createMessageController, getMessagesController, markConversationReadController,
    createDeliveryReceiptController, createReadReceiptController
 } from "./message.controller.js";
import { authMiddleware } from "@/common/middleware/auth.middleware.js";


const router = Router();


router.get("/:conversationId", authMiddleware, getMessagesController);
router.post("/:conversationId", authMiddleware, createMessageController);
router.post("/:conversationId/read-all", authMiddleware, markConversationReadController);
router.post("/:messageId/delivered", authMiddleware, createDeliveryReceiptController);
router.post("/:messageId/read", authMiddleware, createReadReceiptController);

export default router;