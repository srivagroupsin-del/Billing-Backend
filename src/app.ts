import { successResponse } from "./utils/response";
import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import responseTime from "response-time";
import compression from "compression";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { NotFoundError } from "./utils/appError";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.route";
import { authMiddleware } from "./middlewares/auth.middlewares";
import businessRoutes from "./modules/business/business.routes";
import businessSetupRoutes from "./modules/businessSetup/businessSetup.routes";
import storageRoutes from "./modules/storage/storage.routes";
import businesscategorygrouproutes from "./modules/businessCategoryGroup/businessCategoryGroup.routes";
import GroupCatgeorybrandallProductList from "./modules/GroupCatgeorybrandallProductList/GroupCatgeorybrandallProductList.route";
import ProductAllocation from "./modules/productAllocation/productAllocation.routes";
import businessModules from "./modules/businessModules/businessModules.routes";
import stockTypes from "./modules/stockTypes/stockType.routes";
import variantMaster from "./modules/variantMaster/variantMaster.routes";
import stocks from "./modules/stock/stock.routes";
import suppliers from "./modules/suppliers/supplier.routes";
import customer from "./modules/customer/customer.routes";
import sales from "./modules/sales/sales.routes";
import products from "./modules/products/product.routes";
import supplierProduct from "./modules/supplierProduct/supplierProduct.routes";
import quotation from "./modules/quotation/quotation.routes";
import supplierRequest from "./modules/supplierRequest/supplierRequest.routes";
import apiKeyRoutes from "./modules/api_key/apiKey.routes";
import variantsRoutes from "./modules/variants/variants.routes";
import userAppData from "./modules/appvalidation/app_validation_routes";
import storeRoutes from "./modules/store/store.routes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { syncFromRegistry } from "./modules/api_key/apiKey.service";

import userTokenRoutes from "./modules/userTokens/userTokens.routes";
import applicationKeyRoutes from "./modules/applicationKeys/applicationKeys.routes";

const app: Application = express();

app.set("trust proxy", 1); // 👈 ADD THIS LINE

app.use(helmet());
app.use(compression());
app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5000, // increase limit
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
};

// const corsOptions = {
//   origin: ["https://billing.srivagroups.in"], //  no trailing slash
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    console.log(`${req.method} ${req.url} - ${time.toFixed(2)} ms`);
  }),
);

app.get("/", (req: Request, res: Response) => {
  successResponse({
    res,
    message: "Billing Backend is running successfully",
    statusCode: 200,
  });
});

app.use("/api/auth", authRoutes);

// 🔐 Admin
app.use("/api/admin/api-key", apiKeyRoutes);

// 🔓 Public API Keys & Tokens
app.use("/api/user-tokens", userTokenRoutes);
app.use("/api/application-keys", applicationKeyRoutes);

let isSyncing = false;

const safeSync = async () => {
  if (isSyncing) return; // prevent overlap

  try {
    isSyncing = true;
    await syncFromRegistry();
    console.log("Token sync success");
  } catch (err) {
    console.error("Token sync failed:", err);
  } finally {
    isSyncing = false;
  }
};

//  run once (startup)
safeSync();

//  run every 5 minutes
setInterval(safeSync, 5 * 60 * 1000);

app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/businesses", authMiddleware, businessRoutes);
app.use("/api/setup", businessSetupRoutes);
app.use("/api/storage", storageRoutes);
app.use(
  "/api/businesscategorygroup",
  authMiddleware,
  businesscategorygrouproutes,
);
app.use(
  "/api/GroupCatgeorybrandallProductList",
  authMiddleware,
  GroupCatgeorybrandallProductList,
);
app.use("/api/ProductAllocation", authMiddleware, ProductAllocation);
app.use("/api/businessModules", authMiddleware, businessModules);
app.use("/api/stockTypes", authMiddleware, stockTypes);
app.use("/api/variant-master", authMiddleware, variantMaster);
app.use("/api/stocks", authMiddleware, stocks);
app.use("/api/suppliers", authMiddleware, suppliers);
app.use("/api/customer", authMiddleware, customer);
app.use("/api/sales", authMiddleware, sales);
app.use("/api/products", authMiddleware, products);
app.use("/api/supplierProduct", authMiddleware, supplierProduct);
app.use("/api/quotation", authMiddleware, quotation);
app.use("/api/supplierRequest", authMiddleware, supplierRequest);
app.use("/api/variants", variantsRoutes);
app.use("/api/userAppData", userAppData);
app.use("/api/stores", storeRoutes);

// Static uploads
app.use("/uploads", express.static("uploads"));

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
