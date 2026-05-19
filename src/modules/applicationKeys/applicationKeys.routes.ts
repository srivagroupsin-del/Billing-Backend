import { Router } from "express";
import * as controller from "./applicationKeys.controller";

const router = Router();

router.post("/", controller.createOrUpdate);
router.get("/", controller.listAndFilter);

export default router;
