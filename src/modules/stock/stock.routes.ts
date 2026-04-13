import { Router } from "express";
import { StockController } from "./stock.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new StockController();

router.use(authMiddleware);

// Stock CRUD
router.post("/", controller.saveStock);
router.get("/", controller.getStocks);
router.get("/:id", controller.getStockById);
router.put("/:id", controller.updateStock);
router.delete("/:id", controller.deleteStock);

// Multi-location Assignment
router.post("/:stockId/assign-location", controller.assignStockLocations);
router.get("/:stockId/locations", controller.getAssignedLocations);
router.delete("/:stockId/locations", controller.deleteAssignedLocations);

// Single-location Operations
router.put("/location", controller.updateSingleLocation);
router.delete("/location", controller.deleteSingleLocation);

export default router;
