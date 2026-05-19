import { Router } from "express";
import { StoreController } from "./store.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router();
const controller = new StoreController();

// Apply authentication middleware globally to all store routes
router.use(authMiddleware);

/* =========================================================================
   STORES MASTER & PINCODE UTILITY
   ========================================================================= */
router.get("/pincode/details/:pincode", controller.fetchLocationByPincode);

router.post("/", controller.createStore);
router.get("/", controller.getStores);

/* =========================================================================
   DYNAMIC CATEGORIES
   ========================================================================= */
router.get("/categories", controller.getCategories);
router.post("/categories", controller.createCategory);
router.delete("/categories/:catId", controller.deleteCategory);

/* =========================================================================
   PAYMENT METHODS
   ========================================================================= */
router.get("/payment-methods", controller.getPaymentMethods);
router.post("/payment-methods", controller.createPaymentMethod);

/* =========================================================================
   STORE SPECIFIC LIFECYCLE
   ========================================================================= */
router.get("/:id", controller.getStoreById);
router.put("/:id", controller.updateStore);
router.delete("/:id", controller.deleteStore);

/* =========================================================================
   STORE LOCATIONS (Pincode Fetch, Validation, Enforcements)
   ========================================================================= */
router.post("/:id/locations", controller.createLocation);
router.get("/:id/locations", controller.getLocations);
router.put("/:id/locations/:locId", controller.updateLocation);
router.delete("/:id/locations/:locId", controller.deleteLocation);

/* =========================================================================
   STORE COVERAGE MAPPING
   ========================================================================= */
router.post("/:id/coverages", controller.saveCoverage);
router.post("/:id/coverages/bulk", controller.saveCoverageBulk);
router.get("/:id/coverages", controller.getCoverages);
router.delete("/:id/coverages/:covId", controller.deleteCoverage);

/* =========================================================================
   STORE PAYMENT MAPPING
   ========================================================================= */
router.post("/:id/payments", controller.mapStorePayments);
router.get("/:id/payments", controller.getStorePayments);

/* =========================================================================
   STORE WEEKLY TIMINGS & LUNCH BREAKS
   ========================================================================= */
router.post("/:id/timings", controller.saveStoreTimings);
router.get("/:id/timings", controller.getStoreTimings);

/* =========================================================================
   APPOINTMENT SLOTS CONFIG & MANAGEMENT
   ========================================================================= */
router.post("/:id/appointments/config", controller.saveAppointmentConfig);
router.post("/:id/appointments/slots", controller.createAppointmentSlot);
router.get("/:id/appointments/slots", controller.getAppointmentSlots);
router.delete("/:id/appointments/slots/:slotId", controller.deleteAppointmentSlot);

/* =========================================================================
   APPOINTMENT BOOKINGS
   ========================================================================= */
router.post("/appointments/bookings", controller.createAppointmentBooking);
router.get("/:id/appointments/bookings", controller.getBookings);
router.put("/appointments/bookings/:bookingId", controller.updateBookingStatus);
router.delete("/appointments/bookings/:bookingId", controller.deleteBooking);

export default router;
