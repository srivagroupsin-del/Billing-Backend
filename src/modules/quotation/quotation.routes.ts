import { Router } from "express";
import { QuotationController } from "./quotation.controller";

const router = Router();
const controller = new QuotationController();

// create
router.post("/", controller.create);

// list
router.get("/", controller.getAll);

// ✅ PUT THIS FIRST (more specific)
router.delete("/item/:itemId", controller.deleteItem);

// get single
router.get("/:id", controller.getById);

// update
router.put("/:id", controller.update);

// status update
router.patch("/:id/status", controller.updateStatus);

// delete quotation
router.delete("/:id", controller.softDelete);

export default router;
