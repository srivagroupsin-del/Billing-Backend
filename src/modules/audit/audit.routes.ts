import { Router } from "express";
import * as ctrl from "./audit.controller";

const router = Router();

router.get("/counts", ctrl.getAuditCounts);
router.get("/history", ctrl.getAuditHistory);

export default router;
