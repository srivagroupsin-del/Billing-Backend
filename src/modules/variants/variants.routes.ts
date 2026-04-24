import { Router } from "express";
import { VariantsController } from "./variants.controller";

const router = Router();
const controller = new VariantsController();

router.get("/", controller.getAll);

export default router;
