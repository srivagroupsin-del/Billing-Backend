import { Router } from "express";
import {
  getBrandWithProducts,
  getCategoryBrandStructure,
  getCategoryGroupMappings,
} from "./GroupCatgeorybrandallProductList.controller";

const router = Router();

router.get("/", getCategoryGroupMappings);
// API 2
router.get("/categories-brands", getCategoryBrandStructure);

// API 3
router.get("/brand-products/:category_id/:brand_id", getBrandWithProducts);

export default router;
