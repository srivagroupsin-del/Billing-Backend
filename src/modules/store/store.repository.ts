import pool from "../../config/db";
import { BusinessError } from "../../utils/appError";

export class StoreRepository {
  /* =========================================================================
     STORES
     ========================================================================= */

  async createStore(businessId: number, data: any) {
    const { store_name, branch_type, coverage_level, category, subcategory, third_party_coupon_accept } = data;
    const [result]: any = await pool.execute(
      `INSERT INTO stores (business_id, store_name, branch_type, coverage_level, category, subcategory, third_party_coupon_accept)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [businessId, store_name, branch_type, coverage_level ?? null, category, subcategory, third_party_coupon_accept ? 1 : 0]
    );
    return result.insertId;
  }

  async getStores(businessId: number, filters: any) {
    const { page = 1, limit = 10, search = "", category, subcategory, branch_type } = filters;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM stores WHERE business_id = ? AND is_deleted = 0`;
    const params: any[] = [businessId];

    if (search) {
      query += ` AND store_name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (subcategory) {
      query += ` AND subcategory = ?`;
      params.push(subcategory);
    }

    if (branch_type) {
      query += ` AND branch_type = ?`;
      params.push(branch_type);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM (${query}) as countTable`;
    const [countRows]: any = await pool.query(countQuery, params);
    const total = countRows[0]?.count || 0;

    query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows]: any = await pool.query(query, params);
    return { rows, total };
  }

  async getStoreById(storeId: number, businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM stores WHERE id = ? AND business_id = ? AND is_deleted = 0`,
      [storeId, businessId]
    );
    return rows[0] || null;
  }

  async updateStore(storeId: number, businessId: number, data: any) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      "store_name",
      "branch_type",
      "coverage_level",
      "category",
      "subcategory",
      "third_party_coupon_accept",
      "status"
    ];

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === "third_party_coupon_accept" ? (data[key] ? 1 : 0) : data[key]);
      }
    }

    if (fields.length === 0) return 0;

    values.push(storeId, businessId);
    const [result]: any = await pool.execute(
      `UPDATE stores SET ${fields.join(", ")} WHERE id = ? AND business_id = ? AND is_deleted = 0`,
      values
    );
    return result.affectedRows;
  }

  async deleteStore(storeId: number, businessId: number) {
    const [result]: any = await pool.execute(
      `UPDATE stores SET is_deleted = 1 WHERE id = ? AND business_id = ?`,
      [storeId, businessId]
    );
    return result.affectedRows;
  }

  /* =========================================================================
     STORE LOCATIONS (Pincode based / Manual)
     ========================================================================= */

  async createLocation(storeId: number, data: any) {
    const {
      country_id, state_id, district_id, taluk_id, city_id,
      country_name, state_name, district_name, taluk_name, city_name,
      pincode, address, is_primary
    } = data;

    const [result]: any = await pool.execute(
      `INSERT INTO store_locations 
       (store_id, country_id, state_id, district_id, taluk_id, city_id, country_name, state_name, district_name, taluk_name, city_name, pincode, address, is_primary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        storeId, country_id ?? null, state_id ?? null, district_id ?? null, taluk_id ?? null, city_id ?? null,
        country_name ?? null, state_name ?? null, district_name ?? null, taluk_name ?? null, city_name ?? null,
        pincode ?? null, address ?? null, is_primary ? 1 : 0
      ]
    );
    return result.insertId;
  }

  async getLocations(storeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_locations WHERE store_id = ? AND is_deleted = 0`,
      [storeId]
    );
    return rows;
  }

  async getLocationById(locationId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_locations WHERE id = ? AND is_deleted = 0`,
      [locationId]
    );
    return rows[0] || null;
  }

  async updateLocation(locationId: number, storeId: number, data: any) {
    const fields: string[] = [];
    const values: any[] = [];

    const allowedFields = [
      "country_id", "state_id", "district_id", "taluk_id", "city_id",
      "country_name", "state_name", "district_name", "taluk_name", "city_name",
      "pincode", "address", "is_primary"
    ];

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === "is_primary" ? (data[key] ? 1 : 0) : data[key]);
      }
    }

    if (fields.length === 0) return 0;

    values.push(locationId, storeId);
    const [result]: any = await pool.execute(
      `UPDATE store_locations SET ${fields.join(", ")} WHERE id = ? AND store_id = ? AND is_deleted = 0`,
      values
    );
    return result.affectedRows;
  }

  async deleteLocation(locationId: number, storeId: number) {
    const [result]: any = await pool.execute(
      `UPDATE store_locations SET is_deleted = 1 WHERE id = ? AND store_id = ?`,
      [locationId, storeId]
    );
    return result.affectedRows;
  }

  async clearPrimaryLocation(storeId: number) {
    await pool.execute(
      `UPDATE store_locations SET is_primary = 0 WHERE store_id = ? AND is_deleted = 0`,
      [storeId]
    );
  }

  /* =========================================================================
     STORE COVERAGE MAPPING
     ========================================================================= */

  async createCoverage(storeId: number, data: any) {
    const { coverage_level, country_id, state_id, district_id, taluk_id, city_id, pincode, name } = data;
    const [result]: any = await pool.execute(
      `INSERT INTO store_coverages (store_id, coverage_level, country_id, state_id, district_id, taluk_id, city_id, pincode, name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        storeId, coverage_level, country_id ?? null, state_id ?? null, district_id ?? null, taluk_id ?? null, city_id ?? null,
        pincode ?? null, name ?? null
      ]
    );
    return result.insertId;
  }

  async createCoveragesBulk(storeId: number, coverages: any[]) {
    if (!coverages.length) return;
    const values = coverages.map(c => [
      storeId,
      c.coverage_level,
      c.country_id ?? null,
      c.state_id ?? null,
      c.district_id ?? null,
      c.taluk_id ?? null,
      c.city_id ?? null,
      c.pincode ?? null,
      c.name ?? null
    ]);

    await pool.query(
      `INSERT INTO store_coverages (store_id, coverage_level, country_id, state_id, district_id, taluk_id, city_id, pincode, name)
       VALUES ?`,
      [values]
    );
  }

  async getCoverages(storeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_coverages WHERE store_id = ? AND is_deleted = 0`,
      [storeId]
    );
    return rows;
  }

  async deleteCoverage(coverageId: number, storeId: number) {
    const [result]: any = await pool.execute(
      `UPDATE store_coverages SET is_deleted = 1 WHERE id = ? AND store_id = ?`,
      [coverageId, storeId]
    );
    return result.affectedRows;
  }

  async deleteCoveragesBulk(storeId: number, coverageIds: number[]) {
    if (!coverageIds.length) return;
    const [result]: any = await pool.query(
      `UPDATE store_coverages SET is_deleted = 1 WHERE store_id = ? AND id IN (?)`,
      [storeId, coverageIds]
    );
    return result.affectedRows;
  }

  /* =========================================================================
     PAYMENT METHODS (Parent-Child & Store Mappings)
     ========================================================================= */

  async createPaymentMethod(businessId: number | null, name: string, parentId: number | null = null) {
    const [result]: any = await pool.execute(
      `INSERT INTO payment_methods (business_id, name, parent_id) VALUES (?, ?, ?)`,
      [businessId, name, parentId]
    );
    return result.insertId;
  }

  async getPaymentMethods(businessId: number) {
    // Fetches system-wide methods (business_id is null) plus business-specific custom methods
    const [rows]: any = await pool.execute(
      `SELECT * FROM payment_methods 
       WHERE (business_id IS NULL OR business_id = ?) AND is_deleted = 0
       ORDER BY parent_id ASC, id ASC`,
      [businessId]
    );
    return rows;
  }

  async getPaymentMethodById(id: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM payment_methods WHERE id = ? AND is_deleted = 0`,
      [id]
    );
    return rows[0] || null;
  }

  async deletePaymentMethod(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `UPDATE payment_methods SET is_deleted = 1 WHERE id = ? AND business_id = ?`,
      [id, businessId]
    );
    return result.affectedRows;
  }

  async deleteStorePayments(storeId: number) {
    await pool.execute(
      `UPDATE store_payments SET is_deleted = 1 WHERE store_id = ?`,
      [storeId]
    );
  }

  async mapStorePayments(storeId: number, paymentMethodIds: number[]) {
    if (!paymentMethodIds.length) return;
    const values = paymentMethodIds.map(pmId => [storeId, pmId]);
    await pool.query(
      `INSERT INTO store_payments (store_id, payment_method_id) VALUES ?`,
      [values]
    );
  }

  async getStorePayments(storeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT sp.*, pm.name as payment_method_name, pm.parent_id
       FROM store_payments sp
       JOIN payment_methods pm ON sp.payment_method_id = pm.id
       WHERE sp.store_id = ? AND sp.is_deleted = 0 AND pm.is_deleted = 0`,
      [storeId]
    );
    return rows;
  }

  /* =========================================================================
     STORE TIMINGS
     ========================================================================= */

  async getStoreTimings(storeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_timings WHERE store_id = ? AND is_deleted = 0`,
      [storeId]
    );
    return rows;
  }

  async deleteStoreTimings(storeId: number) {
    await pool.execute(
      `UPDATE store_timings SET is_deleted = 1 WHERE store_id = ?`,
      [storeId]
    );
  }

  async saveStoreTimings(storeId: number, timings: any[]) {
    if (!timings.length) return;
    const values = timings.map(t => [
      storeId,
      t.day_of_week,
      t.opening_time ?? null,
      t.closing_time ?? null,
      t.lunch_enabled ? 1 : 0,
      t.lunch_start_time ?? null,
      t.lunch_end_time ?? null,
      t.is_closed ? 1 : 0
    ]);

    await pool.query(
      `INSERT INTO store_timings 
       (store_id, day_of_week, opening_time, closing_time, lunch_enabled, lunch_start_time, lunch_end_time, is_closed)
       VALUES ?`,
      [values]
    );
  }

  /* =========================================================================
     APPOINTMENT CONFIGS
     ========================================================================= */

  async getAppointmentConfigs(storeId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_appointment_configs WHERE store_id = ? AND is_deleted = 0`,
      [storeId]
    );
    return rows;
  }

  async getAppointmentConfig(storeId: number, appointmentType: string) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_appointment_configs 
       WHERE store_id = ? AND appointment_type = ? AND is_deleted = 0`,
      [storeId, appointmentType]
    );
    return rows[0] || null;
  }

  async deleteAppointmentConfig(storeId: number, appointmentType: string) {
    await pool.execute(
      `UPDATE store_appointment_configs SET is_deleted = 1 WHERE store_id = ? AND appointment_type = ?`,
      [storeId, appointmentType]
    );
  }

  async saveAppointmentConfig(storeId: number, data: any) {
    const { appointment_type, slot_duration_mins, booking_limit_per_slot, is_active } = data;
    await pool.execute(
      `INSERT INTO store_appointment_configs (store_id, appointment_type, slot_duration_mins, booking_limit_per_slot, is_active)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         slot_duration_mins = VALUES(slot_duration_mins),
         booking_limit_per_slot = VALUES(booking_limit_per_slot),
         is_active = VALUES(is_active),
         is_deleted = 0`,
      [storeId, appointment_type, slot_duration_mins ?? 30, booking_limit_per_slot ?? 1, is_active ? 1 : 0]
    );
  }

  /* =========================================================================
     APPOINTMENT SLOTS (Overlapping Slots / Limits)
     ========================================================================= */

  async createAppointmentSlot(storeId: number, slot: any) {
    const { appointment_type, date, start_time, end_time, booking_limit } = slot;
    const [result]: any = await pool.execute(
      `INSERT INTO store_appointment_slots (store_id, appointment_type, date, start_time, end_time, booking_limit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [storeId, appointment_type, date, start_time, end_time, booking_limit ?? 1]
    );
    return result.insertId;
  }

  async checkOverlappingSlot(storeId: number, appointmentType: string, date: string, startTime: string, endTime: string, excludeSlotId: number | null = null) {
    let query = `
      SELECT COUNT(*) as count 
      FROM store_appointment_slots
      WHERE store_id = ? 
        AND appointment_type = ? 
        AND date = ? 
        AND is_deleted = 0
        AND (
          (start_time < ? AND end_time > ?)
        )
    `;
    const params: any[] = [storeId, appointmentType, date, endTime, startTime];

    if (excludeSlotId) {
      query += ` AND id != ?`;
      params.push(excludeSlotId);
    }

    const [rows]: any = await pool.execute(query, params);
    return rows[0].count > 0;
  }

  async getAppointmentSlots(storeId: number, filters: any) {
    const { date, appointment_type } = filters;
    let query = `SELECT * FROM store_appointment_slots WHERE store_id = ? AND is_deleted = 0`;
    const params: any[] = [storeId];

    if (date) {
      query += ` AND date = ?`;
      params.push(date);
    }

    if (appointment_type) {
      query += ` AND appointment_type = ?`;
      params.push(appointment_type);
    }

    query += ` ORDER BY date ASC, start_time ASC`;
    const [rows]: any = await pool.execute(query, params);
    return rows;
  }

  async getAppointmentSlotById(slotId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_appointment_slots WHERE id = ? AND is_deleted = 0`,
      [slotId]
    );
    return rows[0] || null;
  }

  async deleteAppointmentSlot(slotId: number, storeId: number) {
    const [result]: any = await pool.execute(
      `UPDATE store_appointment_slots SET is_deleted = 1 WHERE id = ? AND store_id = ?`,
      [slotId, storeId]
    );
    return result.affectedRows;
  }

  /* =========================================================================
     APPOINTMENT BOOKINGS
     ========================================================================= */

  async createAppointmentBooking(data: any) {
    const { slot_id, customer_name, customer_phone, customer_email, booking_status, booking_notes } = data;
    const [result]: any = await pool.execute(
      `INSERT INTO store_appointment_bookings (slot_id, customer_name, customer_phone, customer_email, booking_status, booking_notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [slot_id, customer_name, customer_phone, customer_email ?? null, booking_status ?? "pending", booking_notes ?? null]
    );
    return result.insertId;
  }

  async getSlotActiveBookingsCount(slotId: number) {
    // active bookings = not cancelled & not deleted
    const [rows]: any = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM store_appointment_bookings 
       WHERE slot_id = ? AND booking_status != 'cancelled' AND is_deleted = 0`,
      [slotId]
    );
    return rows[0]?.count || 0;
  }

  async getBookings(storeId: number, filters: any) {
    const { page = 1, limit = 10, status, search } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, s.appointment_type, s.date, s.start_time, s.end_time 
      FROM store_appointment_bookings b
      JOIN store_appointment_slots s ON b.slot_id = s.id
      WHERE s.store_id = ? AND b.is_deleted = 0 AND s.is_deleted = 0
    `;
    const params: any[] = [storeId];

    if (status) {
      query += ` AND b.booking_status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (b.customer_name LIKE ? OR b.customer_phone LIKE ? OR b.customer_email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    // Count
    const countQuery = `SELECT COUNT(*) as count FROM (${query}) as countTable`;
    const [countRows]: any = await pool.query(countQuery, params);
    const total = countRows[0]?.count || 0;

    query += ` ORDER BY s.date DESC, s.start_time DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows]: any = await pool.query(query, params);
    return { rows, total };
  }

  async getBookingById(bookingId: number) {
    const [rows]: any = await pool.execute(
      `SELECT b.*, s.store_id, s.appointment_type, s.date, s.start_time, s.end_time
       FROM store_appointment_bookings b
       JOIN store_appointment_slots s ON b.slot_id = s.id
       WHERE b.id = ? AND b.is_deleted = 0 AND s.is_deleted = 0`,
      [bookingId]
    );
    return rows[0] || null;
  }

  async updateBookingStatus(bookingId: number, status: string) {
    const [result]: any = await pool.execute(
      `UPDATE store_appointment_bookings SET booking_status = ? WHERE id = ? AND is_deleted = 0`,
      [status, bookingId]
    );
    return result.affectedRows;
  }

  async deleteBooking(bookingId: number) {
    const [result]: any = await pool.execute(
      `UPDATE store_appointment_bookings SET is_deleted = 1 WHERE id = ?`,
      [bookingId]
    );
    return result.affectedRows;
  }

  /* =========================================================================
     DYNAMIC CATEGORIES & SUBCATEGORIES
     ========================================================================= */

  async createCategory(businessId: number | null, name: string, parentId: number | null = null) {
    const [result]: any = await pool.execute(
      `INSERT INTO store_categories (business_id, name, parent_id) VALUES (?, ?, ?)`,
      [businessId, name, parentId]
    );
    return result.insertId;
  }

  async getCategories(businessId: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_categories 
       WHERE (business_id IS NULL OR business_id = ?) AND is_deleted = 0
       ORDER BY parent_id ASC, id ASC`,
      [businessId]
    );
    return rows;
  }

  async getCategoryById(id: number) {
    const [rows]: any = await pool.execute(
      `SELECT * FROM store_categories WHERE id = ? AND is_deleted = 0`,
      [id]
    );
    return rows[0] || null;
  }

  async deleteCategory(id: number, businessId: number) {
    const [result]: any = await pool.execute(
      `UPDATE store_categories SET is_deleted = 1 WHERE id = ? AND business_id = ?`,
      [id, businessId]
    );
    return result.affectedRows;
  }
}
