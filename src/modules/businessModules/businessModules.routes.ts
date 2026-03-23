import { Router } from "express";
import { BusinessModulesController } from "./businessModules.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new BusinessModulesController();

router.use(authMiddleware);

/* MODULE CRUD */
router.post("/modules", controller.createModule);
router.get("/modules", controller.getModules);
router.put("/modules/:id", controller.updateModule);
router.delete("/modules/:id", controller.deleteModule);

/* MODULE ITEMS CRUD */
router.post("/modules/items", controller.createModuleItem);
router.get("/modules/:moduleId/items", controller.getModuleItems);
router.put("/modules/items/:id", controller.updateModuleItem);
router.delete("/modules/items/:id", controller.deleteModuleItem);

export default router;