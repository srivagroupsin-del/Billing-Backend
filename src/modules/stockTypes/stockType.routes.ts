import { Router } from "express";
import { StockTypeController } from "./stockType.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new StockTypeController();

router.use(authMiddleware);

router.get("/by-stock", controller.getStockTypesByStock);

router.post("/", controller.createStockType);
router.get("/", controller.getStockTypes);
router.put("/:id", controller.updateStockType);
router.delete("/:id", controller.deleteStockType);

export default router;
