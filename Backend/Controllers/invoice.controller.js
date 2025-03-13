import { Invoice } from '../Models/invoice.model.js';
import { User } from '../Models/user.model.js';
import Stripe from 'stripe';



//This API Handle only one invoice item
export const createInvoice = async (req, res) => {
    const { userId, totalAmount, invoiceItems } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    if(!userId || !totalAmount || invoiceItems.length === 0) {
        return res.status(400).json({ success: false, message: "Please provide all the required fields" });
    }

    if(totalAmount <= 0 ) {
        return res.status(400).json({ success: false, message: "Total amount must be greater than 0" });
    }

    try{
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const product = await stripe.products.create({
            name: invoiceItems[0].serviceName,
        });

        console.log("PRODUCT CREATED: ", product);

        const invoice = new Invoice({
            user: userId,
            invoiceItems: [
                {
                    serviceId: product.id,
                    serviceName: invoiceItems[0].serviceName,
                    servicePrice: invoiceItems[0].servicePrice,
                }
            ],
            total: totalAmount,
        })

        await invoice.save();

        res.status(201).json({ success: true, message: "Invoice created successfully", data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};


export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

export const getInvoiceById = async (req, res) => {

    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
        res.status(200).json({ success: true, data: invoice });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

export const updateInvoiceById = async (req, res) => {
    
    try {
        const { id } = req.params;
        const updates = req.body;
        const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

export const deleteInvoiceById = async (req, res) => {

    try {
        const { id } = req.params;
        const invoice = await Invoice.findByIdAndDelete(id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
        res.status(200).json({ success: true, message: "Invoice deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}