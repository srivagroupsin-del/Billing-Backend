import { catchAsync } from "../../utils/catchAsync";
import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import * as service from "./GroupCatgeorybrandallProductList.service";

export const getCategoryGroupMappings = catchAsync(async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const raw = req.query.category_group_id;

    if (!raw) {
      throw new BusinessError("category_group_id is required", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    // Convert to array safely
    let ids: number[] = [];

    if (Array.isArray(raw)) {
      ids = raw.map((id) => Number(id));
    } else if (typeof raw === "string") {
      ids = raw.split(",").map((id) => Number(id));
    }

    // Validate numbers
    const invalid = ids.some((id) => isNaN(id) || id <= 0);

    if (invalid || ids.length === 0) {
      throw new BusinessError("Valid category_group_id(s) required", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    const data = await service.getCategoryGroupMappings(ids);

    return successResponse({ res, data: data });
  } catch (err: any) {
    throw new BusinessError(err.message || "Something went wrong", ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});

/**
 * GET Category → Brand Structure
 * ?category_group_id=1,2
 */
export const getCategoryBrandStructure = catchAsync(async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const raw = req.query.category_group_id;

    if (!raw) {
      throw new BusinessError("category_group_id is required", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    let ids: number[] = [];

    if (Array.isArray(raw)) {
      ids = raw.map((id) => Number(id));
    } else if (typeof raw === "string") {
      ids = raw.split(",").map((id) => Number(id));
    }

    const invalid = ids.some((id) => isNaN(id) || id <= 0);

    if (invalid || ids.length === 0) {
      throw new BusinessError("Valid category_group_id(s) required", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    const data = await service.getCategoryBrandStructure(ids);

    return successResponse({ res, data: data });
  } catch (err: any) {
    throw new BusinessError(err.message || "Something went wrong", ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});

/**
 * GET Brand → Products
 * /brand-products/5
 */
export const getBrandWithProducts = catchAsync(async (req: AuthRequest, res: Response) => {
  try {
    const { category_id, brand_id } = req.params;

    const categoryId = Number(category_id);
    const brandId = Number(brand_id);

    if (!categoryId || !brandId || isNaN(categoryId) || isNaN(brandId)) {
      throw new BusinessError("Valid category_id and brand_id are required", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    const data = await service.getBrandWithProducts(categoryId, brandId);

    if (!data) {
      throw new BusinessError("Brand not found or no products available", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    return successResponse({ res, data: data });
  } catch (err: any) {
    throw new BusinessError(err.message || "Something went wrong", ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});

export const getProductDynamicFields = catchAsync(async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const productId = Number(req.params.product_id);
    const categoryId = Number(req.params.category_id);
    const brandId = Number(req.params.brand_id);

    if (!productId) {
      throw new BusinessError("Valid product_id required", ErrorCodes.BUSINESS_RULE_VIOLATION);
    }

    const data = await service.fetchProductDynamicFields(
      productId,
      categoryId,
      brandId,
    );

    return successResponse({ res, data: data });
  } catch (err: any) {
    throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
  }
});
