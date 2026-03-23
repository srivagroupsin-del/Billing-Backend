import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import * as service from "./business.service";

export const getAllBusinesses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await service.getAllBusinesses();

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getBusinessById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await service.getBusinessById(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getBusinessByUserId = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const result = await service.getBusinessByUserId(userId);

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllOperationTypes = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await service.getAllOperationTypes();

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

export const enableStorageTypes = async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user?.business_id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Please select a business",
      });
    }

    const { storage_type_ids } = req.body;
    await service.enableStorageTypes(businessId, storage_type_ids);

    res.json({
      success: true,
      message: "Storage types enabled successfully",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getBusinessStorageTypes = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const businessId = req.user?.business_id;

    if(!businessId){
      return res.status(400).json({
        success:false,
        message:"Select business"
      });
    }

    const data = await service.getBusinessStorageTypes(businessId);

    res.json({
      success:true,
      data
    });

  } catch(err:any){

    res.status(400).json({
      success:false,
      message:err.message
    });

  }

};