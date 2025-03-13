import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./Database/db.js";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());
connectDB();



app.get("/test", (req, res) => {
    res.send("App is running successfully");
})


import userRoutes from "./Routes/user.routes.js";
import invoiceRoutes from "./Routes/invoice.routes.js";
import paymentRoutes from "./Routes/payment.routes.js";


app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
    console.log(`Your server is listening on PORT ${PORT}`);
});
