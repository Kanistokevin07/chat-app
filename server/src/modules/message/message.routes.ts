import { Router } from "express";

import { createMessageController, getMessagesController, markConversationReadController,
    createDeliveryReceiptController, createReadReceiptController,
    syncMessagesController,
    editMessageController,
    deleteMessageController
 } from "./message.controller.js";
import { authMiddleware } from "@/common/middleware/auth.middleware.js";


const router = Router();


router.get("/:conversationId", authMiddleware, getMessagesController);
router.post("/:conversationId", authMiddleware, createMessageController);
router.post("/:conversationId/read-all", authMiddleware, markConversationReadController);
router.post("/:messageId/delivered", authMiddleware, createDeliveryReceiptController);
router.post("/:messageId/read", authMiddleware, createReadReceiptController);
router.get("/:conversationId/sync", authMiddleware, syncMessagesController);
router.delete("/:messageId", authMiddleware, deleteMessageController);
router.patch("/edit/:messageId", authMiddleware, editMessageController);

export default router;