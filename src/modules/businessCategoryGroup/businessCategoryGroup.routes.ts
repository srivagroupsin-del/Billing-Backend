import { Router } from "express";
import {
  getBusinessCategoryGroups,
} from "./businessCategoryGroup.controller";

const router = Router();

router.get("/", getBusinessCategoryGroups);

export default router;