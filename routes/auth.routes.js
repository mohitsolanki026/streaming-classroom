import express from'express';
import authController from'../controllers/auth.controller.js';
const router = express.Router();

// for client 
router.post('/client/signup', authController.clientRegister);
router.post('/client/login', authController.clientLogin);

// for teacher
router.post('/teacher/signup', authController.teacherRegister);
router.post('/teacher/login', authController.userLogin);

// for user
router.post('/user/signup', authController.userRegister);
router.post('/user/login', authController.userLogin);

export default router;