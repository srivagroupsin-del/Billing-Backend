import { Router } from "express";
import { CustomerController } from "./customer.controller";

const router = Router();
const controller = new CustomerController();

router.get("/phone/:phone", controller.getCustomerByPhone);
router.get("/getCustomerBybusiness", controller.getCustomerBybusiness);
router.get("/businesscentral", controller.getAllBusinesses);
router.get("/usercentral", controller.getAllUsers);

export default router;
