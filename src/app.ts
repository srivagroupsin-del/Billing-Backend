import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
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

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Billing Backend is running successfully",
  });
});

app.use("/api/auth", authRoutes);
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

// Static uploads
app.use("/uploads", express.static("uploads"));

export default app;
