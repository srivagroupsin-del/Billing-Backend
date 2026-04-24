import { Request, Response } from "express";
import { VariantsService } from "./variants.service";

export class VariantsController {
  private service = new VariantsService();

  getAll = async (_req: Request, res: Response) => {
    try {
      const data = await this.service.getAll();

      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
}