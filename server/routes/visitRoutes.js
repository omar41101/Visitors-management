import express from 'express';
import { 
  createVisit, 
  updateVisitExit, 
  getVisits, 
  getVisitHistory, 
  getVisitById, 
  getVisitorVisitHistory,
  validateQRCode
} from '../controllers/visitController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRole(['admin', 'agent']), createVisit);
router.put('/:id/exit', authenticateJWT, authorizeRole(['admin', 'agent']), updateVisitExit);
router.get('/', authenticateJWT, authorizeRole(['admin', 'agent']), getVisits);
router.get('/history', authenticateJWT, authorizeRole(['admin', 'agent']), getVisitHistory);
router.get('/:id', authenticateJWT, authorizeRole(['admin', 'agent']), getVisitById);
router.get('/visitor/:visitorId/history', authenticateJWT, authorizeRole(['admin', 'agent']), getVisitorVisitHistory);

// QR Code validation route
router.post('/validate-qr', validateQRCode); // No auth required for QR validation

export default router;