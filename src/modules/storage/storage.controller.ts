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
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });
      const id = await this.service.createStorageType(businessId, req.body);
      res
        .status(201)
        .json({ success: true, message: "Storage type created", data: { id } });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  getStorageTypes = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId)
        return res
          .status(400)
          .json({ success: false, message: "Business ID missing", data: {} });
      const types = await this.service.getStorageTypes(businessId);
      res
        .status(200)
        .json({ success: true, message: "Storage types fetched", data: types });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  updateStorageType = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.updateStorageType(Number(id), businessId!, req.body);
      res
        .status(200)
        .json({ success: true, message: "Storage type updated", data: {} });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  deleteStorageType = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.deleteStorageType(Number(id), businessId!);
      res
        .status(200)
        .json({ success: true, message: "Storage type deleted", data: {} });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  // Storage Address Fields
  createAddressField = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const id = await this.service.createAddressField(businessId!, req.body);
      res.status(201).json({
        success: true,
        message: "Address field created",
        data: { id },
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
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
      res.status(200).json({
        success: true,
        message: "Address fields fetched",
        data: fields,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
    }
  };

  // Storage Structure Levels
  createStructureLevel = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const id = await this.service.createStructureLevel(businessId!, req.body);
      res.status(201).json({
        success: true,
        message: "Structure level created",
        data: { id },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error_type: error.type || "CREATE_STRUCTURE_LEVEL_ERROR",
        message: error.message,
      });
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
      res.status(200).json({
        success: true,
        message: "Structure levels fetched",
        data: levels,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: error.message, data: {} });
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
      res
        .status(200)
        .json({ success: true, message: "Structure level updated", data: {} });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error_type: error.type || "UPDATE_STRUCTURE_LEVEL_ERROR",
        message: error.message,
      });
    }
  };

  deleteStructureLevel = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      await this.service.deleteStructureLevel(Number(id), businessId!);
      res
        .status(200)
        .json({ success: true, message: "Structure level deleted", data: {} });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error_type: error.type || "DELETE_STRUCTURE_LEVEL_ERROR",
        message: error.message,
      });
    }
  };

  updateStructureOrder = async (req: AuthRequest, res: Response) => {
    try {
      await this.service.updateStructureOrder(req.body.structure);

      res.json({ success: true });
    } catch (err: any) {
      console.error("❌ REORDER ERROR:", err.message);

      res.status(400).json({
        success: false,
        error_type: "UPDATE_STRUCTURE_LEVEL_ERROR",
        message: err.message,
      });
    }
  };

  // Storage Locations
  createLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const id = await this.service.createLocation(businessId!, req.body);
      res
        .status(201)
        .json({ success: true, message: "Location created", data: { id } });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error_type: error.type || "CREATE_LOCATION_ERROR",
        message: error.message,
      });
    }
  };

  updateLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.updateLocation(Number(id), businessId!, req.body);

      return res.json({
        success: true,
        message: "Location updated successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error_type: error.type || "LOCATION_UPDATE_ERROR",
        message: error.message,
      });
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

      return res.status(200).json({
        success: true,
        message: "Locations fetched",
        data: locations,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
      });
    }
  };

  deleteLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;

      await this.service.deleteLocation(Number(id), businessId!);

      return res.status(200).json({
        success: true,
        message: "Location deleted",
        data: {},
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error_type: error.type || "LOCATION_DELETE_ERROR",
        message: error.message,
      });
    }
  };

  saveAddressValues = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;

      if (!req.body.storage_type_id) {
        return res.status(400).json({ message: "storage_type_id required" });
      }

      if (!req.body.fields || !Array.isArray(req.body.fields)) {
        return res.status(400).json({ message: "fields array required" });
      }

      await this.service.saveAddressValues(businessId!, req.body);

      res.json({
        success: true,
        message: "Address values saved",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
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

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateAddressValue = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;
    const { value } = req.body;

    await this.service.updateAddressValue(Number(id), value, businessId!);

    res.json({ success: true });
  };

  deleteAddressValue = async (req: AuthRequest, res: Response) => {
    const businessId = req.user?.business_id;
    const { id } = req.params;

    await this.service.deleteAddressValue(Number(id), businessId!);

    res.json({ success: true });
  };
}
