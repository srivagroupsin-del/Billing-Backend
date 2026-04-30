import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import responseTime from "response-time";
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
import stocks from "./modules/stock/stock.routes";
import suppliers from "./modules/suppliers/supplier.routes";
import customer from "./modules/customer/customer.routes";
import sales from "./modules/sales/sales.routes";
import products from "./modules/products/product.routes";
import supplierProduct from "./modules/supplierProduct/supplierProduct.routes";
import quotation from "./modules/quotation/quotation.routes";
import supplierRequest from "./modules/supplierRequest/supplierRequest.routes";
import { verifyApiKey } from "./middlewares/api_key.verfication";
import apiKeyRoutes from "./modules/api_key/apiKey.routes";
import variantsRoutes from "./modules/variants/variants.routes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app: Application = express();

app.use(helmet());
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
};

// const corsOptions = {
//   // Removed the trailing slashes from the URLs
//   origin: ["https://billing.srivagroups.in/"],
//   credentials: true,
//   optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
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
  res.status(200).json({
    success: true,
    message: "Billing Backend is running successfully",
  });
});

app.use("/api/auth", authRoutes);

// 🔐 Admin
app.use("/api/admin/api-key", apiKeyRoutes);

// 🔑 Apply API key globally
// app.use("/api", verifyApiKey);

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
app.use("/api/stocks", authMiddleware, stocks);
app.use("/api/suppliers", authMiddleware, suppliers);
app.use("/api/customer", authMiddleware, customer);
app.use("/api/sales", authMiddleware, sales);
app.use("/api/products", authMiddleware, products);
app.use("/api/supplierProduct", authMiddleware, supplierProduct);
app.use("/api/quotation", authMiddleware, quotation);
app.use("/api/supplierRequest", authMiddleware, supplierRequest);
app.use("/api/variants", variantsRoutes);

// Static uploads
app.use("/uploads", express.static("uploads"));

export default app;
