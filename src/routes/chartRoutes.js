import express from 'express';
import chartController from '../controllers/chartController.js';

const router = express.Router();

router.get('/trend/:company', chartController.getTrendChartDataByCompany);
router.get('/category/:category/comparison', chartController.getCategoryComparisonChartData);

export default router; 