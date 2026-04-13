import pool from "../../config/db";
import { StorageRepository } from "./storage.repository";

export class StorageService {
  private repository: StorageRepository;

  constructor() {
    this.repository = new StorageRepository();
  }

  // Helpers for validation
  private trimStrings(data: any): any {
    if (!data || typeof data !== "object") return data;
    for (const key of Object.keys(data)) {
      if (typeof data[key] === "string") {
        data[key] = data[key].trim();
      }
    }
    return data;
  }

  private validateName(name: any): string {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw Object.assign(new Error("Name is required"), {
        type: "VALIDATION_ERROR",
      });
    }
    return name.trim();
  }

  // Storage Types
  async createStorageType(businessId: number, data: any) {
    data = this.trimStrings(data);
    data.name = this.validateName(data.name);
    return await this.repository.createStorageType(businessId, data);
  }

  async getStorageTypes(businessId: number) {
    return await this.repository.getStorageTypes(businessId);
  }

  async updateStorageType(id: number, businessId: number, data: any) {
    data = this.trimStrings(data);
    if (data.name !== undefined) data.name = this.validateName(data.name);
    return await this.repository.updateStorageType(id, businessId, data);
  }

  async deleteStorageType(id: number, businessId: number) {
    const count = await this.repository.countLocationsForStorageType(id);
    if (count > 0) {
      throw Object.assign(
        new Error("Cannot delete structure. Locations exist"),
        { type: "STRUCTURE_IN_USE" },
      );
    }
    return await this.repository.deleteStorageType(id, businessId);
  }

  // Storage Address Fields
  async createAddressField(businessId: number, data: any) {
    data = this.trimStrings(data);
    if (
      !data.field_name ||
      typeof data.field_name !== "string" ||
      data.field_name.trim() === ""
    ) {
      throw Object.assign(new Error("Invalid input"), {
        type: "VALIDATION_ERROR",
      });
    }

    if (data.field_order !== undefined && data.field_order < 1) {
      data.field_order = 1;
    }
    if (data.field_order === undefined || data.field_order === null) {
      const existingFields: any = await this.repository.getAddressFields(
        data.storage_type_id,
      );
      data.field_order = existingFields.length
        ? Math.max(...existingFields.map((f: any) => f.field_order)) + 1
        : 1;
    }

    // Note: businessId ignored as per schema for this table
    return await this.repository.createAddressField(data);
  }

  async getAddressFields(storageTypeId: number, businessId: number) {
    // Note: businessId ignored as per schema for this table
    return await this.repository.getAddressFields(storageTypeId);
  }

  async getAddressValuesGrouped(storageTypeId: number, businessId: number) {
    const rows: any[] = await this.repository.getAddressValues(
      storageTypeId,
      businessId,
    );

    const grouped: {
      [key: number]: {
        id: number;
        fields: { [key: string]: string };
      };
    } = {};

    rows.forEach((row: any) => {
      if (!grouped[row.address_group_id]) {
        grouped[row.address_group_id] = {
          id: row.address_group_id,
          fields: {},
        };
      }

      grouped[row.address_group_id].fields[row.field_name] = row.field_value;
    });

    return Object.values(grouped);
  }

  // Storage Structure Levels
  async createStructureLevel(businessId: number, data: any) {
    data = this.trimStrings(data);
    data.name = this.validateName(data.name);

    if (
      await this.repository.checkDuplicateStructureName(
        data.storage_type_id,
        data.name,
      )
    ) {
      throw Object.assign(new Error("Structure already exists"), {
        type: "DUPLICATE_NAME",
      });
    }

    const levels: any = await this.repository.getStructureLevels(
      data.storage_type_id,
      businessId,
    );
    const maxLevel =
      levels.length > 0
        ? Math.max(...levels.map((l: any) => l.level_order))
        : 0;

    if (data.level_order !== undefined && data.level_order < 1) {
      data.level_order = 1;
    }

    if (data.is_partitionable) {
      const hasPartitionable = await this.repository.hasPartitionableLevel(
        data.storage_type_id,
        businessId,
      );
      if (hasPartitionable) {
        throw Object.assign(new Error("Cannot modify. Data locked"), {
          type: "INVALID_UPDATE",
        });
      }
      // Force it to be the last level
      data.level_order = maxLevel + 1;
    } else {
      if (
        data.level_order === undefined ||
        data.level_order === null ||
        data.level_order > maxLevel + 1
      ) {
        data.level_order = maxLevel + 1;
      }
    }

    const existing = await this.repository.findExistingLevel(
      businessId,
      data.storage_type_id,
      data.level_order,
    );

    // 🔥 If already exists → update instead of insert
    if (existing) {
      await this.updateStructureLevel(existing.id, businessId, data);
      return existing.id; // return same id
    }

    // else create new
    return await this.repository.createStructureLevel(businessId, data);
  }

  async getStructureLevels(storageTypeId: number, businessId: number) {
    return await this.repository.getStructureLevels(storageTypeId, businessId);
  }

  async updateStructureLevel(id: number, businessId: number, data: any) {
    data = this.trimStrings(data);
    if (data.name !== undefined) data.name = this.validateName(data.name);

    // 🔥 Step 1: Get current level
    const level = await this.repository.getStructureLevelById(id, businessId);

    if (!level) {
      throw new Error("Structure level not found");
    }

    if (data.name !== undefined && data.name !== level.name) {
      if (
        await this.repository.checkDuplicateStructureName(
          level.storage_type_id,
          data.name,
        )
      ) {
        throw Object.assign(new Error("Structure already exists"), {
          type: "DUPLICATE_NAME",
        });
      }
    }

    if (data.is_partitionable && !level.is_partitionable) {
      const hasPartitionable = await this.repository.hasPartitionableLevel(
        level.storage_type_id,
        businessId,
        id,
      );
      if (hasPartitionable) {
        throw Object.assign(new Error("Cannot modify. Data locked"), {
          type: "INVALID_UPDATE",
        });
      }

      const levels: any = await this.repository.getStructureLevels(
        level.storage_type_id,
        businessId,
      );
      data.level_order = levels.length
        ? Math.max(...levels.map((l: any) => l.level_order)) + 1
        : 1;
    }

    // 🔥 Step 2: Check if any locations exist for this level
    const hasData = await this.repository.hasLocations(id);

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
        (field) => data[field] !== undefined && data[field] !== level[field],
      );

      if (isTryingRestrictedUpdate) {
        throw Object.assign(new Error("Cannot modify. Data locked"), {
          type: "INVALID_UPDATE",
        });
      }
    }

    // 🔥 Step 4: Proceed update
    return await this.repository.updateStructureLevel(id, businessId, data);
  }

  async deleteStructureLevel(id: number, businessId: number) {
    const level = await this.repository.getStructureLevelById(id, businessId);
    if (!level) throw new Error("Structure level not found");

    const hasLocations = await this.repository.hasLocations(id);
    if (hasLocations) {
      throw Object.assign(
        new Error("Cannot delete structure. Locations exist"),
        { type: "STRUCTURE_IN_USE" },
      );
    }

    const hasProducts = await this.repository.hasProductInStructure(
      id,
      businessId,
    );
    if (hasProducts) {
      throw Object.assign(new Error("Cannot delete. Products assigned"), {
        type: "LOCATION_IN_USE",
      });
    }

    const deletedOrder = level.level_order;
    const result = await this.repository.deleteStructureLevel(id, businessId);

    // Auto normalize order after delete
    await this.repository.normalizeStructureLevelOrders(
      level.storage_type_id,
      deletedOrder,
    );

    return result;
  }

  async createLocation(businessId: number, data: any) {
    data = this.trimStrings(data);
    data.name = this.validateName(data.name);

    // ✅ STEP 1: Normalize code
    if (data.code !== undefined) {
      if (typeof data.code === "string") {
        data.code = data.code.trim();
      }

      if (!data.code) {
        data.code = null; // convert "" → null
      }
    }

    const { storage_type_id, level_id } = data;

    // ✅ STEP 2: Load structure levels
    const levels = await this.repository.getStructureLevels(
      storage_type_id,
      businessId,
    );

    const level = levels.find((l: any) => l.id === level_id);

    if (!level) {
      throw new Error("Invalid structure level");
    }

    // ✅ STEP 3: Auto-generate code (ONLY if null)
    if (!data.code) {
      const prefix = level?.name?.charAt(0).toUpperCase() || "L";

      const lastCode = await this.repository.getNextLocationCode(
        businessId,
        storage_type_id,
        level_id,
      );

      let nextNumber = 1;

      if (lastCode) {
        const match = lastCode.match(/\d+$/);
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      data.code = `${prefix}${nextNumber}`;
    }

    // ✅ STEP 4: Duplicate check (AFTER generation)
    if (data.code) {
      const exists = await this.repository.checkDuplicateLocationCode(
        data.code,
        businessId,
        data.storage_type_id,
        data.parent_id ?? null,
      );

      if (exists) {
        throw Object.assign(new Error("Code already exists"), {
          type: "DUPLICATE_CODE",
        });
      }
    }

    // ✅ STEP 5: Create location
    const locationId = await this.repository.createLocation(businessId, data);

    // ✅ STEP 6: Partition logic (row/column)
    if (level.is_partitionable) {
      const rows = Number(data.partition_rows || 0);
      const cols = Number(data.partition_columns || 0);

      if (!rows || !cols) {
        throw Object.assign(new Error("Rows and columns required"), {
          type: "VALIDATION_ERROR",
        });
      }

      if (rows <= 0 || cols <= 0) {
        throw Object.assign(new Error("Invalid rows/columns"), {
          type: "VALIDATION_ERROR",
        });
      }

      if (rows * cols > 200) {
        throw new Error("Too many partitions (max 200)");
      }

      const partitions = [];

      for (let r = 0; r < rows; r++) {
        const rowLabel = String.fromCharCode(65 + r); // A, B, C

        for (let c = 1; c <= cols; c++) {
          const suffix = `${rowLabel}${c}`;

          partitions.push({
            business_id: businessId,
            storage_type_id,
            level_id,
            parent_id: locationId,
            name: suffix,
            code: `${data.code}-${suffix}`, // always safe now
          });
        }
      }

      await this.repository.createMultipleLocations(partitions);
    }

    return locationId;
  }

  async updateLocation(id: number, businessId: number, data: any) {
    data = this.trimStrings(data);

    if (data.name !== undefined) {
      data.name = this.validateName(data.name);
    }

    // normalize code
    if (data.code !== undefined) {
      if (typeof data.code === "string") {
        data.code = data.code.trim();
      }
      if (!data.code) {
        data.code = null;
      }
    }

    // duplicate check
    if (data.code) {
      // 🔥 BEFORE duplicate check
      const location = await this.repository.getLocationById(id);

      const storageTypeId = data.storage_type_id ?? location.storage_type_id;
      const parentId = data.parent_id ?? location.parent_id ?? null;

      const exists = await this.repository.checkDuplicateLocationCode(
        data.code,
        businessId,
        storageTypeId,
        parentId,
        id,
      );

      if (exists) {
        throw Object.assign(new Error("Code already exists"), {
          type: "DUPLICATE_CODE",
        });
      }
    }

    // product lock
    const hasProducts = await this.repository.hasProductInLocation(
      id,
      businessId,
    );

    if (hasProducts) {
      if (
        data.parent_id !== undefined ||
        data.code !== undefined ||
        data.partition_rows !== undefined ||
        data.partition_columns !== undefined
      ) {
        throw Object.assign(new Error("Cannot modify. Data locked"), {
          type: "INVALID_UPDATE",
        });
      }
    }

    // partition validation
    const isPartitionUpdate =
      data.partition_rows !== undefined && data.partition_columns !== undefined;

    if (isPartitionUpdate) {
      if (
        data.partition_rows === undefined ||
        data.partition_columns === undefined
      ) {
        throw new Error("Both rows and columns required");
      }

      const rows = data.partition_rows;
      const cols = data.partition_columns;

      if (!rows || !cols || rows <= 0 || cols <= 0) {
        throw Object.assign(new Error("Invalid rows/columns"), {
          type: "VALIDATION_ERROR",
        });
      }

      if (rows * cols > 200) {
        throw new Error("Too many partitions (max 200)");
      }
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const children = await this.repository.getChildLocations(id);

      if (children.length && isPartitionUpdate) {
        // check products
        for (const child of children) {
          const hasProducts = await this.repository.hasProductInLocation(
            child.id,
            businessId,
          );

          if (hasProducts) {
            throw Object.assign(
              new Error("Cannot update partition. Products exist"),
              { type: "LOCATION_IN_USE" },
            );
          }
        }

        // delete old partitions
        await this.repository.deleteChildLocations(id, conn);

        // recreate partitions
        const location = await this.repository.getLocationById(id);

        const partitions = [];

        for (let r = 0; r < data.partition_rows; r++) {
          const rowLabel = String.fromCharCode(65 + r);
          for (let c = 1; c <= data.partition_columns; c++) {
            const suffix = `${rowLabel}${c}`;

            partitions.push({
              business_id: businessId,
              storage_type_id: location.storage_type_id,
              level_id: location.level_id,
              parent_id: id,
              name: suffix,
              code: location.code ? `${location.code}-${suffix}` : suffix,
            });
          }
        }

        await this.repository.createMultipleLocations(partitions, conn);
      }

      // 🔥 UPDATE LAST (IMPORTANT)
      const result = await this.repository.updateLocation(
        id,
        businessId,
        data,
        conn,
      );

      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateStructureOrder(structure: any[]) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // ✅ STEP 1: TEMP SHIFT (avoid unique conflict)
      for (const lvl of structure) {
        await conn.query(
          `UPDATE storage_structure_levels
         SET level_order = level_order + 100
         WHERE id = ?`,
          [lvl.id],
        );
      }

      // ✅ STEP 2: APPLY NEW ORDER
      for (const lvl of structure) {
        const [result]: any = await conn.query(
          `UPDATE storage_structure_levels
         SET level_order = ?
         WHERE id = ?`,
          [lvl.level_order, lvl.id],
        );

        if (result.affectedRows === 0) {
          throw new Error(`Structure level not found: ${lvl.id}`);
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  buildLocationTree(locations: any[], structure: any[]) {
    const map: any = {};
    const roots: any[] = [];

    // sort structure by level_order
    const sortedLevels = structure.sort(
      (a, b) => a.level_order - b.level_order,
    );

    const levelOrderMap: any = {};
    sortedLevels.forEach((lvl, index) => {
      levelOrderMap[lvl.id] = index;
    });

    // attach children
    locations.forEach((loc) => {
      map[loc.id] = { ...loc, children: [] };
    });

    locations.forEach((loc) => {
      if (loc.parent_id && map[loc.parent_id]) {
        map[loc.parent_id].children.push(map[loc.id]);
      } else {
        roots.push(map[loc.id]);
      }
    });

    // 🔥 sort children based on level order
    const sortTree = (nodes: any[]) => {
      nodes.sort(
        (a, b) => levelOrderMap[a.level_id] - levelOrderMap[b.level_id],
      );
      nodes.forEach((n) => sortTree(n.children));
    };

    sortTree(roots);

    return roots;
  }

  async getLocations(storageTypeId: number, businessId: number) {
    const locations = await this.repository.getLocations(
      storageTypeId,
      businessId,
    );
    return this.buildLocationTree(locations, locations);
  }

  async deleteLocation(id: number, businessId: number) {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const hasProducts = await this.repository.hasProductInLocation(
        id,
        businessId,
      );

      if (hasProducts) {
        throw Object.assign(new Error("Cannot delete. Products assigned"), {
          type: "LOCATION_IN_USE",
        });
      }

      const children = await this.repository.getChildLocations(id);

      for (const child of children) {
        const hasProducts = await this.repository.hasProductInLocation(
          child.id,
          businessId,
        );

        if (hasProducts) {
          throw Object.assign(
            new Error("Cannot delete. Products exist in partition"),
            { type: "LOCATION_IN_USE" },
          );
        }
      }

      if (children.length) {
        await this.repository.deleteChildLocations(id, conn);
      }

      const result = await this.repository.deleteLocation(id, businessId, conn);

      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
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
