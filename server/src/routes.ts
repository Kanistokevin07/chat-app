import { Router } from "express";

import healthRoute from "@/modules/health/health.route.js";
import authRoute from "@/modules/auth/auth.route.js";
import conversationRoute from "@/modules/conversation/conversation.route.js";
import messageRoute from "@/modules/message/message.routes.js";

const router = Router();

router.use("/health", healthRoute);

router.use("/auth", authRoute);

router.use("/conversations", conversationRoute);

router.use("/messages", messageRoute);

export default router;