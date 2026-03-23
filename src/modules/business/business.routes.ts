import { Router } from "express";
import * as controller from "./business.controller";

const router = Router();

router.get("/my-businesses", controller.getBusinessByUserId);
router.get("/business_operation", controller.getAllOperationTypes);
router.post("/storage-types", controller.enableStorageTypes);
router.get("/storage-types", controller.getBusinessStorageTypes);
router.get("/", controller.getAllBusinesses);
router.get("/:id", controller.getBusinessById);

export default router;