import express from 'express';
import exportController from '../controllers/exportController.js';

const router = express.Router();

router.get('/html/:company', exportController.exportCompanyLatestHTML);
router.get('/html', exportController.exportHTML);
router.get('/csv', exportController.exportCSV);

export default router; 