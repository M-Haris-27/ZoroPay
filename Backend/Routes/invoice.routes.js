import express from "express"
import { createInvoice, getAllInvoices, getInvoiceById, updateInvoiceById, deleteInvoiceById } from "../Controllers/invoice.controller.js";

const router = express.Router();

router.post("/new", createInvoice);
router.get("/all", getAllInvoices);
router.get("/:id", getInvoiceById);
router.put("/:id", updateInvoiceById);
router.delete("/:id", deleteInvoiceById);


export default router;