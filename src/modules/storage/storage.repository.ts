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

  /* =============================
     STORAGE ADDRESS FIELDS
  ============================== */

  async createAddressField(data: any) {
    const storageTypeId = data.storage_type_id ?? null;
    const fieldName = data.field_name ?? null;

    const [result]: any = await pool.execute(
      `INSERT INTO storage_address_fields
       (storage_type_id, field_name)
       VALUES (?, ?)`,
      [storageTypeId, fieldName],
    );

    return result.insertId;
  }

  async getAddressFields(storageTypeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT *
       FROM storage_address_fields
       WHERE storage_type_id = ?`,
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
       ORDER BY level_order`,
      [storageTypeId, businessId],
    );

    return rows;
  }

  // 🔥 Check if any location exists
  async hasLocations(storageTypeId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT id FROM storage_locations 
     WHERE storage_type_id = ? AND business_id = ? 
     LIMIT 1`,
      [storageTypeId, businessId],
    );

    return rows.length > 0;
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

  /* =============================
     STORAGE LOCATIONS
  ============================== */

  // 🔥 Check if stock exists in this location
  async hasStockInLocation(locationId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT id FROM product_stock
     WHERE storage_location_id = ? AND business_id = ?
     LIMIT 1`,
      [locationId, businessId],
    );

    return rows.length > 0;
  }

  // 🔥 Check if location has children
  async hasChildLocations(locationId: number) {
    const [rows]: any = await pool.execute(
      `SELECT id FROM storage_locations 
     WHERE parent_id = ? 
     LIMIT 1`,
      [locationId],
    );

    return rows.length > 0;
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

  async createLocation(businessId: number, data: any) {
    const storageTypeId = data.storage_type_id ?? null;
    const parentId = data.parent_id ?? null;
    const levelId = data.level_id ?? null;
    const code = data.code ?? null;
    const name = data.name ?? null;

    const [result]: any = await pool.execute(
      `INSERT INTO storage_locations
       (business_id, storage_type_id, parent_id, level_id, code, name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [businessId, storageTypeId, parentId, levelId, code, name],
    );

    return result.insertId;
  }

  async updateLocation(id: number, businessId: number, data: any) {
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

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id, businessId);

    const [result]: any = await pool.execute(
      `UPDATE storage_locations
     SET ${fields.join(", ")}
     WHERE id = ? AND business_id = ?`,
      values,
    );

    return result.affectedRows;
  }

  async createMultipleLocations(locations: any[]) {
    if (!locations.length) return;

    const values = locations.map((l) => [
      l.business_id,
      l.storage_type_id,
      l.parent_id ?? null,
      l.level_id,
      l.code,
      l.name,
    ]);

    await pool.query(
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

  async deleteLocation(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `DELETE FROM storage_locations
       WHERE id = ?
       AND business_id = ?`,
      [id, businessId],
    );

    return result.affectedRows;
  }

  async saveAddressValues(businessId: number, data: any) {
    const { storage_type_id, fields } = data;

    const values = fields.map((f: any) => [
      businessId,
      storage_type_id,
      f.field_id,
      f.value,
    ]);

    await pool.query(
      `INSERT INTO storage_address_values
    (business_id,storage_type_id,field_id,field_value)
    VALUES ?`,
      [values],
    );
  }

  async getAddressValues(storageTypeId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT
        sav.id,
        saf.field_name,
        sav.field_value
     FROM storage_address_values sav
     JOIN storage_address_fields saf
       ON saf.id = sav.field_id
     WHERE sav.storage_type_id=? 
     AND sav.business_id=?`,
      [storageTypeId, businessId],
    );

    return rows;
  }

  async updateAddressValue(id: number, value: string, businessId: number) {
    await pool.execute(
      `UPDATE storage_address_values
     SET field_value=?
     WHERE id=? AND business_id=?`,
      [value, id, businessId],
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
