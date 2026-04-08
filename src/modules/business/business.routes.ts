import { Router } from "express";
import * as controller from "./business.controller";

const router = Router();

router.get("/my-businesses", controller.listBusiness);
export default router;