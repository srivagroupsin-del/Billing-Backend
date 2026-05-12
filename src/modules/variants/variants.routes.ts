import { Router } from "express";
import { VariantsController } from "./variants.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new VariantsController();

router.use(authMiddleware);

router.get("/", controller.getAll);

export default router;
