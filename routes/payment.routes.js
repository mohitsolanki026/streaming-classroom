import express from 'express';
import PaymentController from '../controllers/payment.controller.js';
import authMiddleware from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/create-payment-intent', authMiddleware, PaymentController.newPayment);
router.get('/status/:txnId', PaymentController.checkStatus);

export default router;