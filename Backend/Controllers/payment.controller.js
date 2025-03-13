import { Invoice } from "../Models/invoice.model.js";
import { User } from "../Models/user.model.js";
import Stripe from "stripe";




export const createPaymentLink = async (req, res) => {
    const { userId, invoiceId, amount } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if(!userId || !invoiceId || !amount){
        return res.status(400).json({message: "All fields are required"});
    }

    if(amount <= 0) {
        return res.status(400).json({message: "Amount must be greater than 0"});
    }

    try {
        const user = await User.findById(userId);
        const invoice = await Invoice.findById(invoiceId);

        if(!user || !invoice){
            return res.status(404).json({message: "User or invoice not found"});
        }

        const price = await stripe.prices.create({
            currency: 'usd',
            unit_amount: invoice.invoiceItems[0].servicePrice * 100,
            product: `${invoice.invoiceItems[0].serviceId}`,
        });

        console.log("PRICE CREATED: ", price);

        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                price: `${price.id}`,
                quantity: 1,
                },
            ],
        });
        invoice.paymentLink = paymentLink.url;
        await invoice.save();
        console.log("PAYMENT LINK: ", paymentLink);

        return res.status(201).json({success: true, message: "Payment Link Created Successfully", paymentLink: paymentLink.url});

    } catch (error) {
        console.log("ERROR: ", error);
        return res.status(500).json({ sucess: false, message: "Internal Server Error"});
    }
}