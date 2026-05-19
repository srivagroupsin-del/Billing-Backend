import axios from "axios";
import { StoreRepository } from "./store.repository";
import { BusinessError, NotFoundError } from "../../utils/appError";

export class StoreService {
  private repository: StoreRepository;

  constructor() {
    this.repository = new StoreRepository();
  }

  /* =========================================================================
     EXTERNAL PINCODE GEOLOCATION API
     ========================================================================= */

  async fetchLocationByPincode(pincode: string) {
    if (!pincode || pincode.trim().length < 6) {
      throw new BusinessError("Invalid pincode format. Pincode must be at least 6 digits.");
    }

    try {
      const response = await axios.get(`https://localcity.jobes24x7.com/api/pincode/details/${pincode.trim()}`);
      if (response.data?.data?.result === "Success" && Array.isArray(response.data?.data?.data) && response.data?.data?.data.length > 0) {
        return response.data.data.data;
      }
      throw new BusinessError(`No location details found for pincode: ${pincode}`);
    } catch (error: any) {
      if (error instanceof BusinessError) throw error;
      console.error("External pincode API error:", error.message);
      throw new BusinessError(`Failed to fetch location details from external API: ${error.message}`);
    }
  }

  /* =========================================================================
     STORES BUSINESS LOGIC
     ========================================================================= */

  async createStore(businessId: number, data: any) {
    if (!data.store_name) throw new BusinessError("Store name is required.");
    if (!data.branch_type || !["single", "multiple"].includes(data.branch_type)) {
      throw new BusinessError("Branch type must be 'single' or 'multiple'.");
    }
    if (!data.category || !data.subcategory) {
      throw new BusinessError("Category and subcategory are required.");
    }

    const storeId = await this.repository.createStore(businessId, data);

    // If single branch, user can supply pincode to auto-fill primary location in one-go
    if (data.branch_type === "single" && data.pincode) {
      const apiLocs = await this.fetchLocationByPincode(data.pincode);
      const mainLoc = apiLocs[0];

      await this.repository.createLocation(storeId, {
        country_id: mainLoc.country_id,
        state_id: mainLoc.state_id,
        district_id: mainLoc.district_id,
        taluk_id: mainLoc.taluk_id, // Wait, taluk_name is string in sample, taluk_id may not exist, let's keep it null if not present
        city_id: mainLoc.city_id,
        country_name: mainLoc.country_name,
        state_name: mainLoc.state_name,
        district_name: mainLoc.district_name,
        taluk_name: mainLoc.taluk_name,
        city_name: mainLoc.city_name,
        pincode: data.pincode,
        address: data.address || "",
        is_primary: 1
      });
    }

    return storeId;
  }

  async getStores(businessId: number, filters: any) {
    return await this.repository.getStores(businessId, filters);
  }

  async getStoreById(storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found or deleted.");

    const locations = await this.repository.getLocations(storeId);
    const coverages = await this.repository.getCoverages(storeId);
    const payments = await this.repository.getStorePayments(storeId);
    const timings = await this.repository.getStoreTimings(storeId);
    const appointmentConfigs = await this.repository.getAppointmentConfigs(storeId);

    return {
      ...store,
      locations,
      coverages,
      payments,
      timings,
      appointmentConfigs
    };
  }

  async updateStore(storeId: number, businessId: number, data: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found or deleted.");

    return await this.repository.updateStore(storeId, businessId, data);
  }

  async deleteStore(storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    return await this.repository.deleteStore(storeId, businessId);
  }

  /* =========================================================================
     STORE LOCATIONS
     ========================================================================= */

  async createLocation(storeId: number, businessId: number, data: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    // Single branch constraint: single branch should have only one location
    if (store.branch_type === "single") {
      const existing = await this.repository.getLocations(storeId);
      if (existing.length >= 1) {
        throw new BusinessError("Single branch store can only have exactly one location.");
      }
      data.is_primary = true; // For single branch, the only location MUST be primary
    }

    // Pincode setup automation
    if (data.pincode && (!data.city_name || !data.state_name)) {
      const details = await this.fetchLocationByPincode(data.pincode);
      const matched = details[0];
      data.country_id = matched.country_id;
      data.state_id = matched.state_id;
      data.district_id = matched.district_id;
      data.city_id = matched.city_id;
      data.country_name = matched.country_name;
      data.state_name = matched.state_name;
      data.district_name = matched.district_name;
      data.taluk_name = matched.taluk_name;
      data.city_name = matched.city_name;
    }

    // If setting this location as primary, clear primary flag of other locations of this store
    if (data.is_primary) {
      await this.repository.clearPrimaryLocation(storeId);
    } else {
      // If adding multi-branch, make sure at least one is primary. If this is the first location, set it to primary
      const existing = await this.repository.getLocations(storeId);
      if (existing.length === 0) {
        data.is_primary = true;
      }
    }

    return await this.repository.createLocation(storeId, data);
  }

  async getLocations(storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");
    return await this.repository.getLocations(storeId);
  }

  async updateLocation(locationId: number, storeId: number, businessId: number, data: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    const loc = await this.repository.getLocationById(locationId);
    if (!loc || loc.store_id !== storeId) {
      throw new NotFoundError("Location not found under this store.");
    }

    // Single branch constraints
    if (store.branch_type === "single" && data.is_primary === false) {
      throw new BusinessError("The primary location of a single branch store cannot be unset as non-primary.");
    }

    if (data.pincode && data.pincode !== loc.pincode) {
      const details = await this.fetchLocationByPincode(data.pincode);
      const matched = details[0];
      data.country_id = matched.country_id;
      data.state_id = matched.state_id;
      data.district_id = matched.district_id;
      data.city_id = matched.city_id;
      data.country_name = matched.country_name;
      data.state_name = matched.state_name;
      data.district_name = matched.district_name;
      data.taluk_name = matched.taluk_name;
      data.city_name = matched.city_name;
    }

    if (data.is_primary) {
      await this.repository.clearPrimaryLocation(storeId);
    }

    await this.repository.updateLocation(locationId, storeId, data);

    // Multi-branch constraint check: Ensure one is primary
    if (!data.is_primary && loc.is_primary) {
      const all = await this.repository.getLocations(storeId);
      const activePrimary = all.find((l: any) => l.id !== locationId && l.is_primary);
      if (!activePrimary) {
        // Automatically make another location primary if we just unset the only primary one, or throw error
        const firstOther = all.find((l: any) => l.id !== locationId);
        if (firstOther) {
          await this.repository.updateLocation(firstOther.id, storeId, { is_primary: true });
        } else {
          await this.repository.updateLocation(locationId, storeId, { is_primary: true });
          throw new BusinessError("Store must have at least one primary location.");
        }
      }
    }
  }

  async deleteLocation(locationId: number, storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    const loc = await this.repository.getLocationById(locationId);
    if (!loc || loc.store_id !== storeId) {
      throw new NotFoundError("Location not found.");
    }

    if (store.branch_type === "single") {
      throw new BusinessError("Single branch store must have exactly one location. You cannot delete its only location.");
    }

    await this.repository.deleteLocation(locationId, storeId);

    // If we deleted the primary location, we must assign a new primary location automatically from remaining locations
    if (loc.is_primary) {
      const remaining = await this.repository.getLocations(storeId);
      if (remaining.length > 0) {
        await this.repository.updateLocation(remaining[0].id, storeId, { is_primary: true });
      }
    }
  }

  /* =========================================================================
     STORE COVERAGE MAPPING
     ========================================================================= */

  async saveCoverage(storeId: number, businessId: number, data: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    if (data.pincode) {
      const details = await this.fetchLocationByPincode(data.pincode);
      const matched = details[0];
      data.country_id = matched.country_id;
      data.state_id = matched.state_id;
      data.district_id = matched.district_id;
      data.city_id = matched.city_id;
      data.name = matched.city_name;
    }

    return await this.repository.createCoverage(storeId, data);
  }

  async saveCoverageBulk(storeId: number, businessId: number, data: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    const { coverages } = data; // Array of coverage objects
    if (!Array.isArray(coverages) || coverages.length === 0) {
      throw new BusinessError("Coverages array is required and must not be empty.");
    }

    const processedCoverages = [];
    for (const cov of coverages) {
      if (!cov.coverage_level) {
        throw new BusinessError("Each coverage item must have a coverage_level.");
      }

      // If coverage is based on pincode, fetch and validate
      if (cov.coverage_level === "pincode" && cov.pincode) {
        try {
          const details = await this.fetchLocationByPincode(cov.pincode);
          const matched = details[0];
          processedCoverages.push({
            coverage_level: "pincode",
            country_id: matched.country_id,
            state_id: matched.state_id,
            district_id: matched.district_id,
            taluk_id: cov.taluk_id ?? null,
            city_id: matched.city_id,
            pincode: cov.pincode,
            name: matched.city_name
          });
        } catch (err: any) {
          console.warn(`Skipping invalid pincode in bulk coverage mapping: ${cov.pincode}`);
        }
      } else {
        processedCoverages.push(cov);
      }
    }

    if (processedCoverages.length === 0) {
      throw new BusinessError("No valid coverages were provided to map.");
    }

    await this.repository.createCoveragesBulk(storeId, processedCoverages);
    return { count: processedCoverages.length };
  }

  async getCoverages(storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");
    return await this.repository.getCoverages(storeId);
  }

  async deleteCoverage(coverageId: number, storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");
    return await this.repository.deleteCoverage(coverageId, storeId);
  }

  /* =========================================================================
     PAYMENT METHODS (Parent-Child & Store Mapping)
     ========================================================================= */

  async createPaymentMethod(businessId: number, name: string, parentId: number | null = null) {
    if (!name) throw new BusinessError("Payment method name is required.");
    if (parentId) {
      const parent = await this.repository.getPaymentMethodById(parentId);
      if (!parent) throw new NotFoundError("Parent payment method not found.");
    }
    return await this.repository.createPaymentMethod(businessId, name, parentId);
  }

  async getPaymentMethods(businessId: number) {
    const all = await this.repository.getPaymentMethods(businessId);
    // Format parent-child hierarchy nicely
    const parentMap = new Map<any, any>();
    const roots: any[] = [];

    all.forEach((item: any) => {
      item.children = [];
      parentMap.set(item.id.toString(), item);
    });

    all.forEach((item: any) => {
      if (item.parent_id) {
        const parent = parentMap.get(item.parent_id.toString());
        if (parent) {
          parent.children.push(item);
        } else {
          roots.push(item);
        }
      } else {
        roots.push(item);
      }
    });

    return roots;
  }

  async mapStorePayments(storeId: number, businessId: number, paymentMethodIds: number[]) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    if (!Array.isArray(paymentMethodIds)) {
      throw new BusinessError("paymentMethodIds must be an array.");
    }

    // Soft delete existing mappings
    await this.repository.deleteStorePayments(storeId);
    // Add new ones
    if (paymentMethodIds.length > 0) {
      await this.repository.mapStorePayments(storeId, paymentMethodIds);
    }
    return { count: paymentMethodIds.length };
  }

  async getStorePayments(storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");
    return await this.repository.getStorePayments(storeId);
  }

  /* =========================================================================
     STORE TIMINGS & LUNCH BREAKS
     ========================================================================= */

  async saveStoreTimings(storeId: number, businessId: number, timings: any[]) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    if (!Array.isArray(timings) || timings.length === 0) {
      throw new BusinessError("Timings array is required and must not be empty.");
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    timings.forEach(t => {
      if (!validDays.includes(t.day_of_week)) {
        throw new BusinessError(`Invalid day_of_week: ${t.day_of_week}`);
      }
      if (!t.is_closed) {
        if (!t.opening_time || !t.closing_time) {
          throw new BusinessError(`Opening and closing times are required for open day: ${t.day_of_week}`);
        }
        if (t.lunch_enabled) {
          if (!t.lunch_start_time || !t.lunch_end_time) {
            throw new BusinessError(`Lunch start and end times are required when lunch is enabled for ${t.day_of_week}`);
          }
        }
      }
    });

    // Delete existing timings
    await this.repository.deleteStoreTimings(storeId);
    // Insert new timings
    await this.repository.saveStoreTimings(storeId, timings);
    return { count: timings.length };
  }

  async getStoreTimings(storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");
    return await this.repository.getStoreTimings(storeId);
  }

  /* =========================================================================
     APPOINTMENT CONFIGURATION, SLOTS & BOOKING MANAGEMENT
     ========================================================================= */

  async saveAppointmentConfig(storeId: number, businessId: number, configs: any[]) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    if (!Array.isArray(configs)) {
      throw new BusinessError("Appointment configurations must be an array.");
    }

    for (const conf of configs) {
      if (!["Customer Appointment", "Showroom Appointment"].includes(conf.appointment_type)) {
        throw new BusinessError(`Invalid appointment_type: ${conf.appointment_type}`);
      }
      await this.repository.saveAppointmentConfig(storeId, conf);
    }
    return { count: configs.length };
  }

  async createAppointmentSlot(storeId: number, businessId: number, slotData: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    const { appointment_type, date, start_time, end_time } = slotData;
    if (!["Customer Appointment", "Showroom Appointment"].includes(appointment_type)) {
      throw new BusinessError("Appointment type must be 'Customer Appointment' or 'Showroom Appointment'.");
    }
    if (!date || !start_time || !end_time) {
      throw new BusinessError("Date, start_time, and end_time are required.");
    }

    // Prevent overlapping slots for same store, type, date
    const overlaps = await this.repository.checkOverlappingSlot(storeId, appointment_type, date, start_time, end_time);
    if (overlaps) {
      throw new BusinessError("An overlapping appointment slot already exists for this timeframe.");
    }

    // Auto-fetch booking limit from store config if not provided
    if (slotData.booking_limit === undefined) {
      const config = await this.repository.getAppointmentConfig(storeId, appointment_type);
      slotData.booking_limit = config ? config.booking_limit_per_slot : 1;
    }

    return await this.repository.createAppointmentSlot(storeId, slotData);
  }

  async getAppointmentSlots(storeId: number, businessId: number, filters: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    const slots = await this.repository.getAppointmentSlots(storeId, filters);
    // Add current active bookings count for each slot
    const slotsWithCount = [];
    for (const slot of slots) {
      const activeCount = await this.repository.getSlotActiveBookingsCount(slot.id);
      slotsWithCount.push({
        ...slot,
        active_bookings_count: activeCount,
        available_spots: Math.max(0, slot.booking_limit - activeCount)
      });
    }
    return slotsWithCount;
  }

  async deleteAppointmentSlot(slotId: number, storeId: number, businessId: number) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");

    const slot = await this.repository.getAppointmentSlotById(slotId);
    if (!slot || slot.store_id !== storeId) {
      throw new NotFoundError("Slot not found under this store.");
    }

    // Optional business rule check: do not delete slot with active bookings
    const bookingsCount = await this.repository.getSlotActiveBookingsCount(slotId);
    if (bookingsCount > 0) {
      throw new BusinessError("Cannot delete an appointment slot that already has active bookings. Cancel the bookings first.");
    }

    return await this.repository.deleteAppointmentSlot(slotId, storeId);
  }

  async createAppointmentBooking(bookingData: any) {
    const { slot_id, customer_name, customer_phone } = bookingData;
    if (!slot_id || !customer_name || !customer_phone) {
      throw new BusinessError("slot_id, customer_name, and customer_phone are required.");
    }

    const slot = await this.repository.getAppointmentSlotById(slot_id);
    if (!slot) throw new NotFoundError("Appointment slot not found or has been deleted.");

    // Validate booking limits
    const currentBookings = await this.repository.getSlotActiveBookingsCount(slot_id);
    if (currentBookings >= slot.booking_limit) {
      throw new BusinessError(`This appointment slot is fully booked. Limit is ${slot.booking_limit}.`);
    }

    return await this.repository.createAppointmentBooking(bookingData);
  }

  async getBookings(storeId: number, businessId: number, filters: any) {
    const store = await this.repository.getStoreById(storeId, businessId);
    if (!store) throw new NotFoundError("Store not found.");
    return await this.repository.getBookings(storeId, filters);
  }

  async updateBookingStatus(bookingId: number, businessId: number, status: string) {
    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      throw new BusinessError("Invalid booking status. Must be pending, confirmed, cancelled, or completed.");
    }

    const booking = await this.repository.getBookingById(bookingId);
    if (!booking) throw new NotFoundError("Booking not found.");

    // Validate that the booking belongs to a store of the user's business
    const store = await this.repository.getStoreById(booking.store_id, businessId);
    if (!store) throw new NotFoundError("Access denied. Booking belongs to another business.");

    return await this.repository.updateBookingStatus(bookingId, status);
  }

  async deleteBooking(bookingId: number, businessId: number) {
    const booking = await this.repository.getBookingById(bookingId);
    if (!booking) throw new NotFoundError("Booking not found.");

    const store = await this.repository.getStoreById(booking.store_id, businessId);
    if (!store) throw new NotFoundError("Access denied. Booking belongs to another business.");

    return await this.repository.deleteBooking(bookingId);
  }

  /* =========================================================================
     DYNAMIC CATEGORIES & SUBCATEGORIES
     ========================================================================= */

  async createCategory(businessId: number, name: string, parentId: number | null = null) {
    if (!name) throw new BusinessError("Category name is required.");
    if (parentId) {
      const parent = await this.repository.getCategoryById(parentId);
      if (!parent) throw new NotFoundError("Parent category not found.");
    }
    return await this.repository.createCategory(businessId, name, parentId);
  }

  async getCategories(businessId: number) {
    const all = await this.repository.getCategories(businessId);
    // Format hierarchy
    const parentMap = new Map<any, any>();
    const roots: any[] = [];

    all.forEach((item: any) => {
      item.subcategories = [];
      parentMap.set(item.id.toString(), item);
    });

    all.forEach((item: any) => {
      if (item.parent_id) {
        const parent = parentMap.get(item.parent_id.toString());
        if (parent) {
          parent.subcategories.push(item);
        } else {
          roots.push(item);
        }
      } else {
        roots.push(item);
      }
    });

    return roots;
  }

  async deleteCategory(categoryId: number, businessId: number) {
    return await this.repository.deleteCategory(categoryId, businessId);
  }
}
