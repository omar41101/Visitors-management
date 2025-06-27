import express from 'express'
import jwt from 'jsonwebtoken'

import { createVisitor, getVisitors, updateVisitor, deleteVisitor } from '../controllers/visitorController.js'
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js'
const router = express.Router();

 

router.post('/', authenticateJWT, authorizeRole(['admin', 'agent']), createVisitor);
router.get('/', authenticateJWT, authorizeRole(['admin', 'agent']), getVisitors);
router.put('/:id', authenticateJWT, authorizeRole(['admin', 'agent']), updateVisitor);
router.delete('/:id', authenticateJWT, authorizeRole(['admin', 'agent']), deleteVisitor);

export default router 