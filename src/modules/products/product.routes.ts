import { Router } from "express";
import * as ctrl from "./product.controller";
import { uploadTo } from "../../config/multer";

const router = Router();

router.get("/", ctrl.getProducts);
router.get("/:id", ctrl.getProductById);

export default router;
