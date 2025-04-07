import express from 'express';
import cors from 'cors';
import priceRoutes from './routes/priceRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

const app = express();

// Middleware'ler
app.use(cors()); // CORS'u etkinleştir
app.use(express.json()); // JSON istek gövdelerini ayrıştır
app.use(express.urlencoded({ extended: true })); // URL kodlu istek gövdelerini ayrıştır

// Rotalar
app.use('/api/v1/prices', priceRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/meta', metaRoutes);
app.use('/api/v1/charts', chartRoutes);
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI

// Hata Yönetimi Middleware
app.use(errorHandler);

export default app; 