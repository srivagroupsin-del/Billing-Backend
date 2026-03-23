import { Router } from "express";
import { StorageController } from "./storage.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new StorageController();

router.use(authMiddleware);

// Storage Types
router.post("/type", controller.createStorageType);
router.get("/types", controller.getStorageTypes);
router.put("/type/:id", controller.updateStorageType);
router.delete("/type/:id", controller.deleteStorageType);

// Storage Address Fields
router.post("/address-field", controller.createAddressField);
router.get("/address-fields/:storageTypeId", controller.getAddressFields);

// Storage Structure Levels
router.post("/structure", controller.createStructureLevel);
router.get("/structure/:storageTypeId", controller.getStructureLevels);
router.put("/structure/:id", controller.updateStructureLevel);
router.delete("/structure/:id", controller.deleteStructureLevel);

// Storage Locations
router.post("/location", controller.createLocation);
router.put("/location/:id", controller.updateLocation);
router.get("/locations/:storageTypeId", controller.getLocations);
router.delete("/location/:id", controller.deleteLocation);

router.post("/address-value", controller.saveAddressValues);

router.get("/address-values/:storageTypeId", controller.getAddressValues);

router.put("/address-value/:id", controller.updateAddressValue);

router.delete("/address-value/:id", controller.deleteAddressValue);

export default router;
