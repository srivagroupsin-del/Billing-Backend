import { Router } from "express";
import {
  getBrandWithProducts,
  getCategoryBrandStructure,
  getCategoryGroupMappings,
  getProductDynamicFields,
} from "./GroupCatgeorybrandallProductList.controller";

const router = Router();

router.get("/", getCategoryGroupMappings);
// API 2
router.get("/categories-brands", getCategoryBrandStructure);

// API 3
router.get("/brand-products/:category_id/:brand_id", getBrandWithProducts);

router.get(
  "/:product_id/dynamic-fields/:category_id/:brand_id",
  getProductDynamicFields,
);

export default router;
