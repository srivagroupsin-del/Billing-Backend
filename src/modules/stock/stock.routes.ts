import { Router } from "express";
import { StockController } from "./stock.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new StockController();

router.use(authMiddleware);

router.post("/", controller.saveStock);
router.get("/", controller.getStocks);
router.get("/:id", controller.getStockById);
router.put("/:id", controller.updateStock);
router.delete("/:id", controller.deleteStock);

export default router;
