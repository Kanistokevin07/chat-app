import { Router } from "express";
import { addMemberController, createConversationController, createGroupController, getConversationsController, removeMemberController,
    leaveGroupController, promoteMemberController, demoteMemberController
 } from "./conversation.controller.js";
import { authMiddleware } from "@/common/middleware/auth.middleware.js";

const router = Router();

router.post("/private/:userId", authMiddleware, createConversationController);
router.get("/", authMiddleware, getConversationsController);

router.post("/group", authMiddleware, createGroupController);
router.post("/:conversationId/members", authMiddleware, addMemberController);
router.delete("/:conversationId/members/:userId", authMiddleware, removeMemberController);

router.post("/:conversationId/leave", authMiddleware, leaveGroupController);
router.patch("/:conversationId/members/:userId/promote", authMiddleware, promoteMemberController);
router.patch("/:conversationId/members/:userId/demote", authMiddleware, demoteMemberController);

export default router;