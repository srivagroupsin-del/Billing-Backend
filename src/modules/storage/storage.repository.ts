import pool from "../../config/db";

export class StorageRepository {
  /* =============================
     STORAGE TYPES
  ============================== */

  async createStorageType(businessId: number, data: any) {
    const { name } = data;

    const [result]: any = await pool.execute(
      `INSERT INTO storage_types (business_id, name)
       VALUES (?, ?)`,
      [businessId, name],
    );

    return result.insertId;
  }

  async getStorageTypes(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM storage_types
       WHERE business_id = ?`,
      [businessId],
    );

    return rows;
  }

  async updateStorageType(id: number, businessId: number, data: any) {
    const { name } = data;

    const [result]: any = await pool.execute(
      `UPDATE storage_types
       SET name = ?
       WHERE id = ? AND business_id = ?`,
      [name, id, businessId],
    );

    return result.affectedRows;
  }

  async deleteStorageType(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM storage_types
       WHERE id = ? AND business_id = ?`,
      [id, businessId],
    );

    return result.affectedRows;
  }

  async countLocationsForStorageType(storageTypeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count FROM storage_locations 
       WHERE storage_type_id = ?`,
      [storageTypeId],
    );

    return rows[0].count;
  }

  /* =============================
     STORAGE ADDRESS FIELDS
  ============================== */

  async createAddressField(data: any) {
    const storageTypeId = data.storage_type_id ?? null;
    const fieldName = data.field_name ?? null;
    const fieldOrder = data.field_order ?? 0;

    await pool.execute(
      `UPDATE storage_address_fields
       SET field_order = field_order + 1
       WHERE storage_type_id = ?
       AND field_order >= ?`,
      [storageTypeId, fieldOrder],
    );

    const [result]: any = await pool.execute(
      `INSERT INTO storage_address_fields
       (storage_type_id, field_name, field_order)
       VALUES (?, ?, ?)`,
      [storageTypeId, fieldName, fieldOrder],
    );

    return result.insertId;
  }

  async getAddressFields(storageTypeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT *
       FROM storage_address_fields
       WHERE storage_type_id = ?
       ORDER BY field_order ASC`,
      [storageTypeId],
    );

    return rows;
  }

  /* =============================
     STORAGE STRUCTURE LEVELS
  ============================== */

  async findExistingLevel(
    businessId: number,
    storageTypeId: number,
    levelOrder: number,
  ) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM storage_structure_levels
     WHERE business_id = ? 
     AND storage_type_id = ? 
     AND level_order = ?`,
      [businessId, storageTypeId, levelOrder],
    );

    return rows[0];
  }

  async createStructureLevel(businessId: number, data: any) {
    const storageTypeId = data.storage_type_id ?? null;
    const parentId = data.parent_id ?? null;
    const name = data.name ?? null;
    const levelOrder = data.level_order ?? null;
    const isPartitionable = data.is_partitionable ?? false;
    const partitionRows = data.partition_rows ?? null;
    const partitionColumns = data.partition_columns ?? null;

    await pool.execute(
      `UPDATE storage_structure_levels
       SET level_order = level_order + 1
       WHERE storage_type_id = ?
       AND level_order >= ?`,
      [storageTypeId, levelOrder],
    );

    const [result]: any = await pool.execute(
      `INSERT INTO storage_structure_levels
       (business_id, storage_type_id, parent_id, name, level_order,
        is_partitionable, partition_rows, partition_columns)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        businessId,
        storageTypeId,
        parentId,
        name,
        levelOrder,
        isPartitionable,
        partitionRows,
        partitionColumns,
      ],
    );

    return result.insertId;
  }

  async getStructureLevels(storageTypeId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT *
       FROM storage_structure_levels
       WHERE storage_type_id = ?
       AND business_id = ?
       ORDER BY level_order ASC`,
      [storageTypeId, businessId],
    );

    return rows;
  }

  // 🔥 Check if any location exists
  async hasLocations(levelId: number) {
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count FROM storage_locations 
       WHERE level_id = ?`,
      [levelId],
    );

    return rows[0].count > 0;
  }

  // 🔥 Check if any partitionable level exists
  async hasPartitionableLevel(
    storageTypeId: number,
    businessId: number,
    excludeId?: number,
  ) {
    let query = `SELECT COUNT(*) as count FROM storage_structure_levels WHERE storage_type_id = ? AND business_id = ? AND is_partitionable = true`;
    let params: any[] = [storageTypeId, businessId];

    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }

    const [rows]: any = await pool.execute(query, params);
    return rows[0].count > 0;
  }

  // 🔥 Check duplicate name (prevent duplicate name)
  async checkDuplicateStructureName(storageTypeId: number, name: string) {
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count FROM storage_structure_levels
       WHERE storage_type_id = ? AND LOWER(name) = LOWER(?)`,
      [storageTypeId, name],
    );
    return rows[0].count > 0;
  }

  // 🔥 Get single structure level
  async getStructureLevelById(id: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM storage_structure_levels
     WHERE id = ? AND business_id = ?`,
      [id, businessId],
    );

    return rows[0];
  }

  async updateStructureLevel(id: number, businessId: number, data: any) {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }

    if (data.level_order !== undefined) {
      fields.push("level_order = ?");
      values.push(data.level_order);
    }

    if (data.parent_id !== undefined) {
      fields.push("parent_id = ?");
      values.push(data.parent_id ?? null);
    }

    if (data.is_partitionable !== undefined) {
      fields.push("is_partitionable = ?");
      values.push(data.is_partitionable);
    }

    if (data.partition_rows !== undefined) {
      fields.push("partition_rows = ?");
      values.push(data.partition_rows);
    }

    if (data.partition_columns !== undefined) {
      fields.push("partition_columns = ?");
      values.push(data.partition_columns);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id, businessId);

    const [result]: any = await pool.execute(
      `UPDATE storage_structure_levels
     SET ${fields.join(", ")}
     WHERE id = ? AND business_id = ?`,
      values,
    );

    return result.affectedRows;
  }

  async deleteStructureLevel(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM storage_structure_levels
       WHERE id = ?
       AND business_id = ?`,
      [id, businessId],
    );

    return result.affectedRows;
  }

  async normalizeStructureLevelOrders(
    storageTypeId: number,
    deletedOrder: number,
  ) {
    await pool.execute(
      `UPDATE storage_structure_levels
       SET level_order = level_order - 1
       WHERE storage_type_id = ?
       AND level_order > ?`,
      [storageTypeId, deletedOrder],
    );
  }

  /* =============================
     STORAGE LOCATIONS
  ============================== */

  // 🔥 Check if stock exists in this location
  async hasProductInLocation(locationId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count
     FROM product_stock
     WHERE storage_location_id = ? AND business_id = ?`,
      [locationId, businessId],
    );

    return Number(rows[0].count) > 0; // ✅ IMPORTANT
  }

  // 🔥 Check if stock exists in this structure (level)
  async hasProductInStructure(levelId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count
       FROM product_stock ps
       JOIN storage_locations sl ON sl.id = ps.storage_location_id
       WHERE sl.level_id = ? AND ps.business_id = ?`,
      [levelId, businessId],
    );

    return rows[0].count > 0;
  }

  // 🔥 Check if location has children
  async hasChildLocations(locationId: number) {
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count FROM storage_locations 
       WHERE parent_id = ?`,
      [locationId],
    );

    return rows[0].count > 0;
  }

  async getStockInLocation(locationId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT 
        ps.product_id,
        p.product_name
     FROM product_stock ps
     LEFT JOIN srivagroupsin_product_db_2.product p 
       ON p.id = ps.product_id
     WHERE ps.storage_location_id = ? 
     AND ps.business_id = ?
     LIMIT 3`,
      [locationId, businessId],
    );

    return rows;
  }

  async checkDuplicateLocationCode(
    code: string,
    businessId: number,
    parentId: number | null,
    excludeId?: number,
  ) {
    let query = `
    SELECT COUNT(*) as count 
    FROM storage_locations
    WHERE code = ? 
    AND business_id = ?
    AND parent_id ${parentId ? "= ?" : "IS NULL"}
  `;

    const params: any[] = [code, businessId];

    if (parentId) {
      params.push(parentId);
    }

    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }

    const [rows]: any = await pool.execute(query, params);

    return rows[0].count > 0;
  }

  async getNextLocationCode(
    businessId: number,
    storageTypeId: number,
    levelId: number,
  ) {
    const [rows]: any = await pool.execute(
      `
    SELECT code 
    FROM storage_locations
    WHERE business_id = ?
    AND storage_type_id = ?
    AND level_id = ?
    AND code IS NOT NULL
    ORDER BY CAST(SUBSTRING(code, 2) AS UNSIGNED) DESC
    LIMIT 1
    `,
      [businessId, storageTypeId, levelId],
    );

    return rows[0]?.code || null;
  }

  async getLocationById(id: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM storage_locations WHERE id = ?`,
      [id],
    );
    return rows[0];
  }

  async createLocation(businessId: number, data: any) {
    const storageTypeId = data.storage_type_id ?? null;
    const parentId = data.parent_id ?? null;
    const levelId = data.level_id ?? null;

    const code =
      typeof data.code === "string" && data.code.trim() !== ""
        ? data.code.trim()
        : null;

    const name = data.name ?? null;

    const partitionRows = data.partition_rows ?? null;
    const partitionCols = data.partition_columns ?? null;

    const [result]: any = await pool.execute(
      `INSERT INTO storage_locations
     (business_id, storage_type_id, parent_id, level_id, code, name, partition_rows, partition_columns)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        businessId,
        storageTypeId,
        parentId,
        levelId,
        code,
        name,
        partitionRows,
        partitionCols,
      ],
    );

    return result.insertId;
  }

  async updateLocation(id: number, businessId: number, data: any, conn?: any) {
    const executor = conn || pool;

    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }

    if (data.code !== undefined) {
      fields.push("code = ?");
      values.push(data.code);
    }

    if (data.parent_id !== undefined) {
      fields.push("parent_id = ?");
      values.push(data.parent_id ?? null);
    }

    if (data.partition_rows !== undefined) {
      fields.push("partition_rows = ?");
      values.push(data.partition_rows);
    }

    if (data.partition_columns !== undefined) {
      fields.push("partition_columns = ?");
      values.push(data.partition_columns);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id, businessId);

    const [result]: any = await executor.execute(
      `UPDATE storage_locations
     SET ${fields.join(", ")}
     WHERE id = ? AND business_id = ?`,
      values,
    );

    return result.affectedRows;
  }

  async createMultipleLocations(locations: any[], conn?: any) {
    if (!locations.length) return;

    const executor = conn || pool;

    const values = locations.map((l) => [
      l.business_id,
      l.storage_type_id,
      l.parent_id ?? null,
      l.level_id,
      l.code,
      l.name,
    ]);

    await executor.query(
      `INSERT INTO storage_locations
     (business_id, storage_type_id, parent_id, level_id, code, name)
     VALUES ?`,
      [values],
    );
  }

  async getLocations(storageTypeId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT *
       FROM storage_locations
       WHERE storage_type_id = ?
       AND business_id = ?`,
      [storageTypeId, businessId],
    );

    return rows;
  }

  async getChildLocations(parentId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM storage_locations WHERE parent_id = ?`,
      [parentId],
    );
    return rows;
  }

  async deleteChildLocations(parentId: number, conn?: any) {
    const executor = conn || pool;

    await executor.execute(
      `DELETE FROM storage_locations WHERE parent_id = ?`,
      [parentId],
    );
  }

  async deleteLocation(id: number, businessId: number, conn?: any) {
    const executor = conn || pool;

    const [result]: any = await executor.execute(
      `DELETE FROM storage_locations
     WHERE id = ? AND business_id = ?`,
      [id, businessId],
    );

    return result.affectedRows;
  }

  async saveAddressValues(businessId: number, data: any) {
    const { storage_type_id, fields } = data;

    const groupId = Date.now(); // or use uuid

    const values = fields.map((f: any) => [
      businessId,
      storage_type_id,
      f.field_id,
      f.value ?? null,
      groupId,
    ]);

    await pool.query(
      `INSERT INTO storage_address_values
   (business_id, storage_type_id, field_id, field_value, address_group_id)
   VALUES ?`,
      [values],
    );
  }

  async getAddressValues(storageTypeId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT
      sav.id,
      sav.field_id,
      sav.address_group_id,
      saf.field_name,
      sav.field_value
    FROM storage_address_values sav
    JOIN storage_address_fields saf
      ON saf.id = sav.field_id
    WHERE sav.storage_type_id=? 
    AND sav.business_id=?
    ORDER BY sav.address_group_id`,
      [storageTypeId, businessId],
    );

    return rows;
  }

  async updateAddressValue(id: number, value: string, businessId: number) {
    await pool.execute(
      `UPDATE storage_address_values
     SET field_value = ?
     WHERE id = ? AND business_id = ?`,
      [value ?? null, id, businessId],
    );
  }

  async deleteAddressValue(id: number, businessId: number) {
    await pool.execute(
      `DELETE FROM storage_address_values
     WHERE id=? AND business_id=?`,
      [id, businessId],
    );
  }
}
