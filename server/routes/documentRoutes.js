import express from 'express';
import { createDocument, signDocument } from '../controllers/documentController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, authorizeRole(['admin']), createDocument);
router.post('/:documentId/sign', authenticateJWT, signDocument);

export default router;