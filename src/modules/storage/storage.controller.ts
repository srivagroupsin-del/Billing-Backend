import { successResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StorageService } from "./storage.service";

export class StorageController {
  private service: StorageService;

  constructor() {
    this.service = new StorageService();
  }

  // Storage Types
  createStorageType = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);
      const id = await this.service.createStorageType(businessId, req.body);
      successResponse({ res, data: { id }, message: "Storage type created", statusCode: 201 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStorageTypes = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        throw new BusinessError("Business ID missing", ErrorCodes.BUSINESS_RULE_VIOLATION);
      const types = await this.service.getStorageTypes(businessId);
      successResponse({ res, data: types, message: "Storage types fetched", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateStorageType = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.updateStorageType(Number(id), businessId!, req.body);
      successResponse({ res, data: {}, message: "Storage type updated", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteStorageType = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.deleteStorageType(Number(id), businessId!);
      successResponse({ res, data: {}, message: "Storage type deleted", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  // Storage Address Fields
  createAddressField = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const id = await this.service.createAddressField(businessId!, req.body);
      successResponse({ res, data: { id }, message: "Address field created", statusCode: 201 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAddressFields = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { storageTypeId } = req.params;
      const fields = await this.service.getAddressFields(
        Number(storageTypeId),
        businessId!,
      );
      successResponse({ res, data: fields, message: "Address fields fetched", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  // Storage Structure Levels
  createStructureLevel = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const id = await this.service.createStructureLevel(businessId!, req.body);
      successResponse({ res, data: { id }, message: "Structure level created", statusCode: 201 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStructureLevels = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { storageTypeId } = req.params;
      const levels = await this.service.getStructureLevels(
        Number(storageTypeId),
        businessId!,
      );
      successResponse({ res, data: levels, message: "Structure levels fetched", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateStructureLevel = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.updateStructureLevel(
        Number(id),
        businessId!,
        req.body,
      );
      successResponse({ res, data: {}, message: "Structure level updated", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteStructureLevel = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.deleteStructureLevel(Number(id), businessId!);
      successResponse({ res, data: {}, message: "Structure level deleted", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateStructureOrder = async (req: AuthRequest, res: Response) => {
    try {
      await this.service.updateStructureOrder(req.body.structure);

      successResponse({ res });
    } catch (err: any) {
      console.error(" REORDER ERROR:", err.message);

      throw new BusinessError(err.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  // Storage Locations
  createLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const id = await this.service.createLocation(businessId!, req.body);
      successResponse({ res, data: { id }, message: "Location created", statusCode: 201 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.updateLocation(Number(id), businessId!, req.body);

      return successResponse({ res, message: "Location updated successfully" });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getLocations = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { storageTypeId } = req.params;

      const locations = await this.service.getLocations(
        Number(storageTypeId),
        businessId!,
      );

      return successResponse({ res, data: locations, message: "Locations fetched", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.deleteLocation(Number(id), businessId!);

      return successResponse({ res, data: {}, message: "Location deleted", statusCode: 200 });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  saveAddressValues = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!req.body.storage_type_id) {
        return successResponse({ res, message: "storage_type_id required", statusCode: 400 });
      }

      if (!req.body.fields || !Array.isArray(req.body.fields)) {
        return successResponse({ res, message: "fields array required", statusCode: 400 });
      }

      await this.service.saveAddressValues(businessId!, req.body);

      successResponse({ res, message: "Address values saved" });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAddressValues = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { storageTypeId } = req.params;

      const data = await this.service.getAddressValues(
        Number(storageTypeId),
        businessId!,
      );

      successResponse({ res, data: data });
    } catch (error: any) {
      throw new BusinessError(error.message, ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateAddressValue = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;
    const { value } = req.body;

    await this.service.updateAddressValue(Number(id), value, businessId!);

    successResponse({ res });
  };

  deleteAddressValue = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.deleteAddressValue(Number(id), businessId!);

    successResponse({ res });
  };
}
