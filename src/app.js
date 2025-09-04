import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";

import priceRoutes from "./routes/priceRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import chartRoutes from "./routes/chartRoutes.js";

import errorHandler from "./middlewares/errorHandler.js";
import { globalLimiter, heavyLimiter } from "./middlewares/rateLimit.js";

const app = express();

// Middleware'ler
app.set("trust proxy", true);
app.use(cors()); // CORS'u etkinleştir
app.use(express.json()); // JSON istek gövdelerini ayrıştır
app.use(express.urlencoded({ extended: true })); // URL kodlu istek gövdelerini ayrıştır

// Rate Limits
app.use(globalLimiter);
app.use("/api/v1/export", heavyLimiter, exportRoutes);
app.use("/api/v1/charts", heavyLimiter, chartRoutes);

// Rotalar
app.use("/api/v1/prices", priceRoutes);
app.use("/api/v1/export", exportRoutes);
app.use("/api/v1/meta", metaRoutes);
app.use("/api/v1/charts", chartRoutes);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI

// 404 yakalayıcı
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Hata Yönetimi Middleware
app.use(errorHandler);

export default app;
