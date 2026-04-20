import { Router } from "express";
import { SupplierProductController } from "./supplierProduct.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new SupplierProductController();

router.use(authMiddleware);

// create (bulk)
router.post("/", controller.createBulk);

// list
router.get("/", controller.getAll);

// update
router.put("/:id", controller.update);

// soft delete
router.delete("/:id", controller.softDelete);

export default router;
