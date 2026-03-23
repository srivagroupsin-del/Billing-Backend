import { StorageRepository } from "./storage.repository";

export class StorageService {
  private repository: StorageRepository;

  constructor() {
    this.repository = new StorageRepository();
  }

  // Storage Types
  async createStorageType(businessId: number, data: any) {
    return await this.repository.createStorageType(businessId, data);
  }

  async getStorageTypes(businessId: number) {
    return await this.repository.getStorageTypes(businessId);
  }

  async updateStorageType(id: number, businessId: number, data: any) {
    return await this.repository.updateStorageType(id, businessId, data);
  }

  async deleteStorageType(id: number, businessId: number) {
    return await this.repository.deleteStorageType(id, businessId);
  }

  // Storage Address Fields
  async createAddressField(businessId: number, data: any) {
    // Note: businessId ignored as per schema for this table
    return await this.repository.createAddressField(data);
  }

  async getAddressFields(storageTypeId: number, businessId: number) {
    // Note: businessId ignored as per schema for this table
    return await this.repository.getAddressFields(storageTypeId);
  }

  // Storage Structure Levels
  async createStructureLevel(businessId: number, data: any) {
    const existing = await this.repository.findExistingLevel(
      businessId,
      data.storage_type_id,
      data.level_order,
    );

    // 🔥 If already exists → update instead of insert
    if (existing) {
      await this.repository.updateStructureLevel(existing.id, businessId, data);

      return existing.id; // return same id
    }

    // else create new
    return await this.repository.createStructureLevel(businessId, data);
  }

  async getStructureLevels(storageTypeId: number, businessId: number) {
    return await this.repository.getStructureLevels(storageTypeId, businessId);
  }

  async updateStructureLevel(id: number, businessId: number, data: any) {
    // 🔥 Step 1: Get current level
    const level = await this.repository.getStructureLevelById(id, businessId);

    if (!level) {
      throw new Error("Structure level not found");
    }

    // 🔥 Step 2: Check if any locations exist
    const hasData = await this.repository.hasLocations(
      level.storage_type_id,
      businessId,
    );

    // 🔥 Step 3: If data exists → restrict updates
    if (hasData) {
      const restrictedFields = [
        "level_order",
        "parent_id",
        "is_partitionable",
        "partition_rows",
        "partition_columns",
      ];

      const isTryingRestrictedUpdate = restrictedFields.some(
        (field) => data[field] !== undefined,
      );

      if (isTryingRestrictedUpdate) {
        throw new Error(
          "Structure is locked. Only name can be updated after locations are created",
        );
      }
    }

    // 🔥 Step 4: Proceed update
    return await this.repository.updateStructureLevel(id, businessId, data);
  }

  async deleteStructureLevel(id: number, businessId: number) {
    return await this.repository.deleteStructureLevel(id, businessId);
  }

  // Storage Locations
  async createLocation(businessId: number, data: any) {
    const { storage_type_id, level_id, parent_id, name, code } = data;
    const locationId = await this.repository.createLocation(businessId, data);

    // Check if this level is partitionable
    const levels: any = await this.repository.getStructureLevels(
      storage_type_id,
      businessId,
    );
    const currentLevel = levels.find((l: any) => l.id === level_id);

    if (currentLevel && currentLevel.is_partitionable) {
      const rows = currentLevel.partition_rows || 0;
      const cols = currentLevel.partition_columns || 0;
      const partitions = [];

      for (let r = 0; r < rows; r++) {
        const rowLabel = String.fromCharCode(65 + r); // A, B, C...
        for (let c = 1; c <= cols; c++) {
          const partitionSuffix = `${rowLabel}${c}`;
          partitions.push({
            business_id: businessId,
            storage_type_id: storage_type_id,
            level_id: level_id,
            parent_id: locationId, // Parent is the current location node
            name: partitionSuffix,
            code: `${code}-${partitionSuffix}`,
          });
        }
      }

      if (partitions.length > 0) {
        await this.repository.createMultipleLocations(partitions);
      }
    }

    return locationId;
  }

  async updateLocation(id: number, businessId: number, data: any) {
    const stocks = await this.repository.getStockInLocation(id, businessId);

    if (stocks.length > 0) {
      const productNames = stocks.map((s: any) => s.product_name).join(", ");

      if (data.parent_id !== undefined) {
        throw new Error(
          `Cannot move location. Products (${productNames}) exist here`,
        );
      }

      if (data.code !== undefined) {
        throw new Error(
          `Cannot change code. Products (${productNames}) exist here`,
        );
      }
    }

    return await this.repository.updateLocation(id, businessId, data);
  }
  buildLocationTree(locations: any[]) {
    const map: any = {};
    const roots: any[] = [];

    locations.forEach((loc) => {
      map[loc.id] = { ...loc, children: [] };
    });

    locations.forEach((loc) => {
      if (loc.parent_id) {
        map[loc.parent_id].children.push(map[loc.id]);
      } else {
        roots.push(map[loc.id]);
      }
    });

    return roots;
  }

  async getLocations(storageTypeId: number, businessId: number) {
    const locations = await this.repository.getLocations(
      storageTypeId,
      businessId,
    );
    return this.buildLocationTree(locations);
  }

  async deleteLocation(id: number, businessId: number) {
    // 🔥 Step 1: Check stock
    const stocks = await this.repository.getStockInLocation(id, businessId);

    if (stocks.length > 0) {
      const productNames = stocks.map((s: any) => s.product_name).join(", ");

      throw new Error(
        `Cannot delete location. Products (${productNames}) exist in this location`,
      );
    }

    // 🔥 Step 2: Check children
    const hasChildren = await this.repository.hasChildLocations(id);

    if (hasChildren) {
      throw new Error("Cannot delete location. Child locations exist");
    }

    // ✅ Safe delete
    return await this.repository.deleteLocation(id, businessId);
  }

  async saveAddressValues(businessId: number, data: any) {
    return await this.repository.saveAddressValues(businessId, data);
  }

  async getAddressValues(storageTypeId: number, businessId: number) {
    return await this.repository.getAddressValues(storageTypeId, businessId);
  }

  async updateAddressValue(id: number, value: string, businessId: number) {
    return await this.repository.updateAddressValue(id, value, businessId);
  }

  async deleteAddressValue(id: number, businessId: number) {
    return await this.repository.deleteAddressValue(id, businessId);
  }
}
