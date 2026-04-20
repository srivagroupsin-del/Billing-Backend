import { Router } from "express";
import { SupplierController } from "./supplier.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new SupplierController();

router.get("/", controller.getSuppliers);

export default router;
