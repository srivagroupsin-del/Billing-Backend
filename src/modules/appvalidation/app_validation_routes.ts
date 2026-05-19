import { Router } from "express";
import * as controller from "./app_validation_controller";

const router = Router();

router.post("/", controller.userAppDataController);
router.get("/", controller.getUserAppDataController);
export default router;
