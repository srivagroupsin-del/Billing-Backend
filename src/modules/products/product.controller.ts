import { Request, Response } from "express";
import * as service from "./product.service";
import { AuthRequest } from "../../middlewares/auth.middlewares";

/* ===============================
   GET ROUTES
================================ */
export const getProducts = async (_: Request, res: Response) => {
  try {
    const data = await service.fetchProducts();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const data = await service.fetchProductById(Number(req.params.id));
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};
