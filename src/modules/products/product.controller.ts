import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Request, Response } from "express";
import * as service from "./product.service";

/* ===============================
   GET ROUTES
================================ */
export const getProducts = catchAsync(async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";

    const data = await service.fetchProducts(search);

    successResponse({ res, data: data });
  } catch (error: any) {
    throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});

export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const data = await service.fetchProductById(Number(req.params.id));
      successResponse({ res, data: data });
    } catch (error: any) {
      throw new BusinessError(
        error.message,
        ErrorCodes.BUSINESS_RULE_VIOLATION,
      );
    }
  },
);
