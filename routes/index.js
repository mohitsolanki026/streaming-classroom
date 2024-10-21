import express from 'express';
import authRoutes from './auth.routes.js';
import meetRoutes from './meet.routes.js';
import courseRouter from './course.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/meet', meetRoutes);
router.use('/course', courseRouter);

export default router;