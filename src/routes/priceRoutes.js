import express from 'express';
import priceController from '../controllers/priceController.js';

const router = express.Router();

router.get('/latest', priceController.getLatestPrices);
router.get('/latest/:company', priceController.getLatestPriceByCompany);
router.get('/history/:company', priceController.getHistoricalPricesByCompany);
router.get('/category/:category', priceController.getCategoryPriceAnalysis);

export default router; 