import {Router} from "express";
import {registerController, loginController, refreshController, logoutController} from "./auth.controller.js";
import { validate } from "@/common/middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router=Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);

export default router;