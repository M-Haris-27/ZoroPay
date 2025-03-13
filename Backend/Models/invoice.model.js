import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invoiceItems: [
      { 
        serviceId:{
          type: String,
          required: true,
        },
        
        serviceName: {
          type: String,
          required: true,
          trim: true,
        },

        servicePrice: {
          type: Number,
          required: true,
        },
      },
    ],

    paymentDate: {
      type: Date,
    },

    paymentLink : {
      type: String,
    },

    total: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },
    
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
