import { Router } from "express";
import { SupplierController } from "./supplier.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new SupplierController();

router.use(authMiddleware);

router.post("/",controller.createSupplier);
router.get("/",controller.getSuppliers);
router.put("/:id",controller.updateSupplier);
router.delete("/:id",controller.deleteSupplier);

export default router;