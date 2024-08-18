import express from 'express';
import authRoutes from './auth.routes.js';
import meetRoutes from './meet.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/meet', meetRoutes);

export default router;