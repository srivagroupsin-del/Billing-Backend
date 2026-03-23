import { Router } from "express";
import { BusinessSetupController } from "./businessSetup.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new BusinessSetupController();

router.use(authMiddleware);

// router.post("/setup", controller.createSetup);
router.get("/setup", controller.getSetup);
router.delete("/setup/:id", controller.deleteSetup);

// router.post("/setup/shop-types", controller.assignShopTypes);
router.get("/shop-types", controller.getAllShopTypes);
// router.post("/setup/category-groups", controller.assignCategoryGroups);
// router.post("/setup/categories", controller.assignCategories);
router.post("/setup/brands", controller.assignBrands);

router.post("/full", controller.saveFullSetup);

export default router;