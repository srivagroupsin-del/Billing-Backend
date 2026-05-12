import { successResponse } from "../../utils/response";
import { Router } from "express";
import { login, selectBusiness } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();

router.post("/login", login);

// protected test route
router.get("/me", authMiddleware, (req, res) => {
  successResponse({ res, message: "Authorized user" });
});
router.post("/select-business", authMiddleware, selectBusiness);

export default router;
