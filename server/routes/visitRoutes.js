import express from 'express';
import { createVisit, updateVisitExit, getVisits } from '../controllers/visitController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRole(['admin', 'agent']), createVisit);
router.put('/:id/exit', authenticateJWT, authorizeRole(['admin', 'agent']), updateVisitExit);
router.get('/', authenticateJWT, authorizeRole(['admin', 'agent']), getVisits);

export default router;