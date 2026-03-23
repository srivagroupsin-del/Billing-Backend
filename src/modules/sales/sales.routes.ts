import { Router } from "express";
import { SalesController } from "./sales.controller";

const router = Router();
const controller = new SalesController();

// 🔹 Create Bill
router.post("/bill", controller.createBill);

// 🔹 Get All Bills
router.get("/bills", controller.getBillsByBusiness);

// 🔹 Get Bill by ID (basic)
router.get("/bill/id/:id", controller.getBillById);

// 🔹 Get Bill by Number
router.get("/bill/number/:billNumber", controller.getBillByNumber);

// 🔥 NEW → Full Bill Details (IMPORTANT)
router.get("/bill/details/:id", controller.getFullBillDetails);

export default router;
