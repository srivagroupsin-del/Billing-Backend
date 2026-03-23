import { Router } from "express";
import { ProductAllocationController } from "./productAllocation.controller";

const router = Router();
const controller = new ProductAllocationController();

router.post("/", controller.allocateProducts);
router.get("/", controller.getAllocatedProducts);
router.put("/:id", controller.updateAllocation);
router.delete("/:id", controller.deleteAllocation);

export default router;

// {
//   "setup_id": 1,
//   "category_group_id": 2,
//   "category_id": 5,
//   "brand_id": 3,
//   "products": [
//     {
//       "product_id": 1001,
//       "min_sale_qty": 1,
//       "max_sale_qty": 3
//     },
//     {
//       "product_id": 1002,
//       "min_sale_qty": 2,
//       "max_sale_qty": 10
//     }
//   ]
// }
