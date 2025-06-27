import express from 'express';
import { createDocument, signDocument, getDocuments, getDocument, downloadDocument } from '../controllers/documentController.js';
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateJWT, authorizeRole(['admin', 'agent']), getDocuments);
router.get('/:id', authenticateJWT, authorizeRole(['admin', 'agent']), getDocument);
router.get('/:id/download', authenticateJWT, authorizeRole(['admin', 'agent']), downloadDocument);
router.post('/', authenticateJWT, authorizeRole(['admin']), createDocument);
router.post('/:documentId/sign', authenticateJWT, signDocument);

export default router;