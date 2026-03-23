import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new CustomerController();

// router.use(authMiddleware);

router.get("/phone/:phone", controller.getCustomerByPhone);
router.get("/getCustomerBybusiness", controller.getCustomerBybusiness);

export default router;
