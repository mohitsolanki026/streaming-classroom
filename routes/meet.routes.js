import express from 'express';
import meetController from '../controllers/meet.controller.js';
import auth from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/create',auth, meetController.createMeet);
router.get('/list/{courseId}',auth, meetController.getMeetByCourseId);
router.get('/list',auth, meetController.getMeets);
// router.get('/get/:id', meetController.getMeet);
router.put('/update/:id',auth, meetController.updateMeet);
router.post('/teacher/callToken',auth, meetController.token);
router.post('/user/callToken',auth, meetController.token);

export default router;