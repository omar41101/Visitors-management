import express from 'express'
import jwt from 'jsonwebtoken'

import { createVisitor, getVisitors } from '../controllers/visitorController.js'
import { authenticateJWT, authorizeRole } from '../middlewares/authMiddleware.js'
const router = express.Router();

 

router.post('/', authenticateJWT, authorizeRole(['admin', 'agent']), createVisitor);
router.get('/', authenticateJWT, authorizeRole(['admin', 'agent']), getVisitors);

export default router 