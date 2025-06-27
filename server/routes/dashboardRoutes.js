import express from 'express';
import { getOverview, getStats, exportDashboard } from '../controllers/dashboardController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/overview', authenticateJWT, authorizeRole(['admin']), getOverview);
router.get('/stats', authenticateJWT, authorizeRole(['admin']), getStats);
router.get('/export', authenticateJWT, authorizeRole(['admin']), exportDashboard);

export default router;