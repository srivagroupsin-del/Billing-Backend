import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middlewares";
import { StoreService } from "./store.service";
import { successResponse, paginationResponse } from "../../utils/response";
import { BusinessError } from "../../utils/appError";
import { ErrorCodes } from "../../utils/errorCodes";

export class StoreController {
  private service: StoreService;

  constructor() {
    this.service = new StoreService();
  }

  /* =========================================================================
     UTILITY: PINCODE GEOLOCATION FETCH
     ========================================================================= */

  fetchLocationByPincode = async (req: AuthRequest, res: Response) => {
    try {
      const pincode = String(req.params.pincode);
      const details = await this.service.fetchLocationByPincode(pincode);
      return successResponse({
        res,
        message: "Pincode location details fetched successfully",
        data: details,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     STORES SETUP
     ========================================================================= */

  createStore = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId) {
        throw new BusinessError("Business ID missing from authentication token.", ErrorCodes.UNAUTHORIZED);
      }
      const storeId = await this.service.createStore(Number(businessId), req.body);
      return successResponse({
        res,
        message: "Store created successfully",
        data: { id: storeId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStores = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId) {
        throw new BusinessError("Business ID missing.", ErrorCodes.UNAUTHORIZED);
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = String(req.query.search || "").trim();
      const category = req.query.category ? String(req.query.category) : undefined;
      const subcategory = req.query.subcategory ? String(req.query.subcategory) : undefined;
      const branch_type = req.query.branch_type ? String(req.query.branch_type) : undefined;

      const { rows, total } = await this.service.getStores(Number(businessId), {
        page,
        limit,
        search,
        category,
        subcategory,
        branch_type
      });

      return paginationResponse(res, rows, total, page, limit, "Stores fetched successfully");
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStoreById = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      if (!businessId) {
        throw new BusinessError("Business ID missing.", ErrorCodes.UNAUTHORIZED);
      }
      const store = await this.service.getStoreById(Number(id), Number(businessId));
      return successResponse({
        res,
        message: "Store details fetched successfully",
        data: store,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateStore = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      if (!businessId) {
        throw new BusinessError("Business ID missing.", ErrorCodes.UNAUTHORIZED);
      }
      await this.service.updateStore(Number(id), Number(businessId), req.body);
      return successResponse({
        res,
        message: "Store updated successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteStore = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id } = req.params;
      if (!businessId) {
        throw new BusinessError("Business ID missing.", ErrorCodes.UNAUTHORIZED);
      }
      await this.service.deleteStore(Number(id), Number(businessId));
      return successResponse({
        res,
        message: "Store soft deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     STORE LOCATIONS
     ========================================================================= */

  createLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const locationId = await this.service.createLocation(Number(storeId), Number(businessId), req.body);
      return successResponse({
        res,
        message: "Store location added successfully",
        data: { id: locationId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getLocations = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const locations = await this.service.getLocations(Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Store locations fetched successfully",
        data: locations,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId, locId } = req.params;
      await this.service.updateLocation(Number(locId), Number(storeId), Number(businessId), req.body);
      return successResponse({
        res,
        message: "Store location updated successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteLocation = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId, locId } = req.params;
      await this.service.deleteLocation(Number(locId), Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Store location soft deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     COVERAGE MAPPING
     ========================================================================= */

  saveCoverage = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const coverageId = await this.service.saveCoverage(Number(storeId), Number(businessId), req.body);
      return successResponse({
        res,
        message: "Store coverage region mapped successfully",
        data: { id: coverageId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  saveCoverageBulk = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const result = await this.service.saveCoverageBulk(Number(storeId), Number(businessId), req.body);
      return successResponse({
        res,
        message: `Successfully mapped ${result.count} coverage regions in bulk`,
        data: result,
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getCoverages = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const coverages = await this.service.getCoverages(Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Store coverages fetched successfully",
        data: coverages,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteCoverage = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId, covId } = req.params;
      await this.service.deleteCoverage(Number(covId), Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Store coverage mapping soft deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     PAYMENT METHODS & MAPPING
     ========================================================================= */

  createPaymentMethod = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { name, parent_id } = req.body;
      const pmId = await this.service.createPaymentMethod(Number(businessId), name, parent_id ? Number(parent_id) : null);
      return successResponse({
        res,
        message: "Custom payment method created successfully",
        data: { id: pmId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getPaymentMethods = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId) {
        throw new BusinessError("Business ID missing.", ErrorCodes.UNAUTHORIZED);
      }
      const hierarchy = await this.service.getPaymentMethods(Number(businessId));
      return successResponse({
        res,
        message: "Payment methods fetched successfully",
        data: hierarchy,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  mapStorePayments = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const { paymentMethodIds } = req.body;
      const result = await this.service.mapStorePayments(Number(storeId), Number(businessId), paymentMethodIds);
      return successResponse({
        res,
        message: "Store payment methods mapped successfully",
        data: result,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStorePayments = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const payments = await this.service.getStorePayments(Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Store payment mappings fetched successfully",
        data: payments,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     STORE TIMINGS
     ========================================================================= */

  saveStoreTimings = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const result = await this.service.saveStoreTimings(Number(storeId), Number(businessId), req.body.timings);
      return successResponse({
        res,
        message: "Store timings saved successfully",
        data: result,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getStoreTimings = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const timings = await this.service.getStoreTimings(Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Store timings fetched successfully",
        data: timings,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     APPOINTMENT CONFIGURATION, SLOTS & BOOKINGS
     ========================================================================= */

  saveAppointmentConfig = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const result = await this.service.saveAppointmentConfig(Number(storeId), Number(businessId), req.body.configs);
      return successResponse({
        res,
        message: "Store appointment configuration updated",
        data: result,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  createAppointmentSlot = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const slotId = await this.service.createAppointmentSlot(Number(storeId), Number(businessId), req.body);
      return successResponse({
        res,
        message: "Appointment slot created successfully",
        data: { id: slotId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getAppointmentSlots = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const date = req.query.date ? String(req.query.date) : undefined;
      const appointment_type = req.query.appointment_type ? String(req.query.appointment_type) : undefined;

      const slots = await this.service.getAppointmentSlots(Number(storeId), Number(businessId), { date, appointment_type });
      return successResponse({
        res,
        message: "Appointment slots fetched successfully",
        data: slots,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteAppointmentSlot = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId, slotId } = req.params;
      await this.service.deleteAppointmentSlot(Number(slotId), Number(storeId), Number(businessId));
      return successResponse({
        res,
        message: "Appointment slot deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  createAppointmentBooking = async (req: AuthRequest, res: Response) => {
    try {
      const bookingId = await this.service.createAppointmentBooking(req.body);
      return successResponse({
        res,
        message: "Appointment booked successfully",
        data: { id: bookingId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getBookings = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { id: storeId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status ? String(req.query.status) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;

      const { rows, total } = await this.service.getBookings(Number(storeId), Number(businessId), { page, limit, status, search });
      return paginationResponse(res, rows, total, page, limit, "Bookings fetched successfully");
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { bookingId } = req.params;
      const { status } = req.body;
      await this.service.updateBookingStatus(Number(bookingId), Number(businessId), status);
      return successResponse({
        res,
        message: "Booking status updated successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteBooking = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { bookingId } = req.params;
      await this.service.deleteBooking(Number(bookingId), Number(businessId));
      return successResponse({
        res,
        message: "Booking soft deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  /* =========================================================================
     DYNAMIC CATEGORIES & SUBCATEGORIES
     ========================================================================= */

  createCategory = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { name, parent_id } = req.body;
      const catId = await this.service.createCategory(Number(businessId), name, parent_id ? Number(parent_id) : null);
      return successResponse({
        res,
        message: "Store Category created successfully",
        data: { id: catId },
        statusCode: 201
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  getCategories = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      if (!businessId) {
        throw new BusinessError("Business ID missing.", ErrorCodes.UNAUTHORIZED);
      }
      const categories = await this.service.getCategories(Number(businessId));
      return successResponse({
        res,
        message: "Categories fetched successfully",
        data: categories,
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };

  deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
      const businessId = req.user?.business_id;
      const { catId } = req.params;
      await this.service.deleteCategory(Number(catId), Number(businessId));
      return successResponse({
        res,
        message: "Store Category soft deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      throw new BusinessError(error.message, error.errorCode || ErrorCodes.BUSINESS_RULE_VIOLATION);
    }
  };
}
