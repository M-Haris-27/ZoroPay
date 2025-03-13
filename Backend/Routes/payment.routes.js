import express from "express";
import { createPaymentLink } from "../Controllers/payment.controller.js";

const router = express.Router();

router.post("/create-payment-link", createPaymentLink)


export default router;