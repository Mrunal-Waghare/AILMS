import express from 'express';
import { StripeOrder, verifyPayment } from '../controllers/orderController.js';
import isAuth from "../Middleware/isAuth.js";


const paymentRouter = express.Router();

paymentRouter.post("/stripe-order", StripeOrder)
paymentRouter.post("/verifypayment", isAuth, verifyPayment)

export default paymentRouter;