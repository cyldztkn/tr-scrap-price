import express from "express";
import metaController from "../controllers/metaController.js";

const router = express.Router();

router.get("/companies", metaController.getCompanies);
router.get("/stats", metaController.getStats);

export default router;
