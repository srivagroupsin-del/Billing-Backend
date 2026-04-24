import { Router } from "express";
import { SupplierController } from "./supplier.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new SupplierController();

// ==========================
// 🧾 SUPPLIER ROUTES
// ==========================
router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getOne);
router.put("/update/:id", authMiddleware, controller.update);
router.delete("/delete/:id", authMiddleware, controller.delete);

// ==========================
// 🌿 BRANCH ROUTES
// ==========================
router.post("/branch/create", authMiddleware, controller.createBranch);
router.get("/branch/:supplierId", authMiddleware, controller.getBranches);
router.put("/branch/update/:id", authMiddleware, controller.updateBranch);
router.delete("/branch/delete/:id", authMiddleware, controller.deleteBranch);

export default router;
