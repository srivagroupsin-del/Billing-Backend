import { Router } from "express";
import { VariantMasterController } from "./variantMaster.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new VariantMasterController();

router.use(authMiddleware);

router.post("/", controller.createVariant);
router.get("/", controller.getVariants);
router.put("/:id", controller.updateVariant);
router.delete("/:id", controller.deleteVariant);

export default router;
