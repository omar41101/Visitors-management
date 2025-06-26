import express from 'express';
import { getStats } from '../controllers/dashboardController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateJWT, authorizeRole(['admin']), getStats);

export default router;