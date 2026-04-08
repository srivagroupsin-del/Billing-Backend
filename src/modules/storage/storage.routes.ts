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
router.put("/structure/reorder", controller.updateStructureOrder);
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

// ALTER TABLE storage_address_fields
// ADD COLUMN field_order INT DEFAULT 0;

// SET @rownum := 0;
// SET @current_type := 0;

// UPDATE storage_address_fields saf
// JOIN (
//     SELECT id,
//            (@rownum := IF(@current_type = storage_type_id, @rownum + 1, 1)) AS rn,
//            (@current_type := storage_type_id) AS dummy
//     FROM storage_address_fields
//     ORDER BY storage_type_id, id
// ) temp ON saf.id = temp.id
// SET saf.field_order = temp.rn;

// SELECT storage_type_id, field_order, COUNT(*)
// FROM storage_address_fields
// GROUP BY storage_type_id, field_order
// HAVING COUNT(*) > 1;

// SELECT *
// FROM storage_address_fields
// WHERE field_order = 0;

// ALTER TABLE storage_address_fields
// ADD UNIQUE (storage_type_id, field_order);

// ALTER TABLE storage_structure_levels
// DROP INDEX unique_structure_level;

// UPDATE storage_structure_levels
// SET level_order = 999
// WHERE is_partitionable = 1;

// SET @rownum := 0;
// SET @current_type := 0;

// UPDATE storage_structure_levels
// JOIN (
//     SELECT
//         id,
//         storage_type_id,
//         is_partitionable,
//         (@rownum := IF(@current_type = storage_type_id, @rownum + 1, 1)) AS rn,
//         (@current_type := storage_type_id)
//     FROM storage_structure_levels
//     ORDER BY storage_type_id, is_partitionable ASC, level_order ASC
// ) AS temp
// ON storage_structure_levels.id = temp.id
// SET storage_structure_levels.level_order = temp.rn;

// SELECT storage_type_id, name, level_order, is_partitionable
// FROM storage_structure_levels
// ORDER BY storage_type_id, level_order;

// ALTER TABLE storage_structure_levels
// ADD UNIQUE unique_structure_level (business_id, storage_type_id, level_order);

// SELECT storage_type_id, level_order, COUNT(*)
// FROM storage_structure_levels
// GROUP BY storage_type_id, level_order
// HAVING COUNT(*) > 1;
