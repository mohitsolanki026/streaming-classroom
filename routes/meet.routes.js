import express from 'express';
import meetController from '../controllers/meet.controller.js';
import teacherAuth from '../middlewares/teacher.middleware.js';
import userAuth from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/create',teacherAuth, meetController.createMeet);
router.get('/list',userAuth, meetController.getMeets);
// router.get('/get/:id', meetController.getMeet);
router.put('/update/:id',teacherAuth, meetController.updateMeet);
router.post('/teacher/callToken',teacherAuth, meetController.token);
router.post('/user/callToken',teacherAuth, meetController.token);
router.get('/upcoming',teacherAuth, meetController.getUpcomingMeets);


export default router;