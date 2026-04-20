import { Router } from "express";
import { SupplierRequestController } from "./supplierRequest.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new SupplierRequestController();

router.use(authMiddleware);

// 🔹 CREATE
router.post("/", controller.create);

// 🔹 LISTS (IMPORTANT: specific routes first)
router.get("/sent", controller.getAll); // requests created by business
router.get("/received", controller.getReceived); // requests received as supplier

// 🔹 DELETE ITEM (specific before :id)
router.delete("/item/:itemId", controller.deleteItem);

// 🔹 SINGLE REQUEST
router.get("/:id", controller.getById);

// 🔹 UPDATE
router.put("/:id", controller.update);

// 🔹 STATUS UPDATE
router.patch("/:id/status", controller.updateStatus);

// 🔹 DELETE FULL
router.delete("/:id", controller.softDelete);

export default router;
