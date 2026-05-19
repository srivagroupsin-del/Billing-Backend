import { Router } from "express";
import { ProductAllocationController } from "./productAllocation.controller";

const router = Router();
const controller = new ProductAllocationController();

router.post("/", controller.allocateProducts);
router.get("/", controller.getAllocatedProducts);
router.get("/:product_id", controller.getAllocatedProductById);
router.put("/:id", controller.updateAllocation);
router.delete("/:id", controller.deleteAllocation);

export default router;
