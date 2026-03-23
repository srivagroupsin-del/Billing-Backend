import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import * as service from "./GroupCatgeorybrandallProductList.service";

export const getCategoryGroupMappings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const raw = req.query.category_group_id;

    if (!raw) {
      return res.status(400).json({
        success: false,
        message: "category_group_id is required",
      });
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
      return res.status(400).json({
        success: false,
        message: "Valid category_group_id(s) required",
      });
    }

    const data = await service.getCategoryGroupMappings(ids);

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

/**
 * GET Category → Brand Structure
 * ?category_group_id=1,2
 */
export const getCategoryBrandStructure = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const raw = req.query.category_group_id;

    if (!raw) {
      return res.status(400).json({
        success: false,
        message: "category_group_id is required",
      });
    }

    let ids: number[] = [];

    if (Array.isArray(raw)) {
      ids = raw.map((id) => Number(id));
    } else if (typeof raw === "string") {
      ids = raw.split(",").map((id) => Number(id));
    }

    const invalid = ids.some((id) => isNaN(id) || id <= 0);

    if (invalid || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid category_group_id(s) required",
      });
    }

    const data = await service.getCategoryBrandStructure(ids);

    return res.json({
      success: true,
      data,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

/**
 * GET Brand → Products
 * /brand-products/5
 */
export const getBrandWithProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const { category_id, brand_id } = req.params;

    const categoryId = Number(category_id);
    const brandId = Number(brand_id);

    if (!categoryId || !brandId || isNaN(categoryId) || isNaN(brandId)) {
      return res.status(400).json({
        success: false,
        message: "Valid category_id and brand_id are required",
      });
    }

    const data = await service.getBrandWithProducts(categoryId, brandId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Brand not found or no products available",
      });
    }

    return res.json({
      success: true,
      data,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};